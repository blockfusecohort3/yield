// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FarmInvestment {
    struct Farm {
        uint256 id;
        address farmer;
        uint256 budget;
        uint256 farmSize;
        uint256 insuranceAmount;
        uint256 totalShares;
        uint256 sharePrice;
        uint256 totalInvested;
        bool isFunded;
        address[] investors;
        mapping(address => uint256) investments;
    }

    uint256 public nextFarmId;
    mapping(uint256 => Farm) private farms;
    uint256[] public farmIds;

    // ROI balances that investors can withdraw
    mapping(address => uint256) public roiBalances;

    event FarmCreated(uint256 farmId, address farmer, uint256 budget, uint256 farmSize, uint256 insuranceAmount);
    event SharesPurchased(uint256 farmId, address investor, uint256 shares, uint256 amount);
    event RepaymentMade(uint256 farmId, uint256 amount);
    event ROIAllocated(address investor, uint256 amount);
    event ROIWithdrawn(address investor, uint256 amount);

    modifier onlyFarmer(uint256 _farmId) {
        require(farms[_farmId].farmer == msg.sender, "Not the farmer of this farm");
        _;
    }

    /// @notice Create a new farm
    function createFarm(uint256 _budget, uint256 _farmSize, uint256 _totalShares) external {
        require(_budget > 0 && _farmSize > 0 && _totalShares > 0, "Invalid farm parameters");

        uint256 insuranceAmount = calculateInsurance(_budget, _farmSize);
        uint256 sharePrice = _budget / _totalShares;

        Farm storage farm = farms[nextFarmId];
        farm.id = nextFarmId;
        farm.farmer = msg.sender;
        farm.budget = _budget;
        farm.farmSize = _farmSize;
        farm.insuranceAmount = insuranceAmount;
        farm.totalShares = _totalShares;
        farm.sharePrice = sharePrice;
        farm.totalInvested = 0;
        farm.isFunded = false;

        farmIds.push(nextFarmId);

        emit FarmCreated(nextFarmId, msg.sender, _budget, _farmSize, insuranceAmount);

        nextFarmId++;
    }

    /// @notice Investors buy shares in a farm
    function buyShares(uint256 _farmId, uint256 _shares) external payable {
        Farm storage farm = farms[_farmId];
        require(_shares > 0, "Shares must be greater than 0");
        require(farm.totalInvested < farm.budget, "Farm already fully funded");

        uint256 cost = _shares * farm.sharePrice;
        require(msg.value == cost, "Incorrect payment amount");

        // If new investor, add to investor list
        if (farm.investments[msg.sender] == 0) {
            farm.investors.push(msg.sender);
        }

        farm.investments[msg.sender] += _shares;
        farm.totalInvested += cost;

        if (farm.totalInvested >= farm.budget) {
            farm.isFunded = true;
        }

        emit SharesPurchased(_farmId, msg.sender, _shares, cost);
    }

    /// @notice Farmer makes repayment, contract allocates ROI to investors
    function makeRepayment(uint256 _farmId) external payable onlyFarmer(_farmId) {
        Farm storage farm = farms[_farmId];
        require(farm.isFunded, "Farm not fully funded");
        require(msg.value > 0, "Must repay with value");
        require(msg.value == farm.totalInvested, "Repayment must equal total invested amount");

        // Allocate ROI to each investor proportionally
        for (uint256 i = 0; i < farm.investors.length; i++) {
            address investor = farm.investors[i];
            uint256 shares = farm.investments[investor];
            uint256 investedAmount = shares * farm.sharePrice;

            // proportional ROI allocation
            uint256 roi = (investedAmount * msg.value) / farm.totalInvested;

            roiBalances[investor] += roi;
            emit ROIAllocated(investor, roi);
        }

        emit RepaymentMade(_farmId, msg.value);
    }

    /// @notice Investors withdraw their allocated ROI (pull system)
    function withdrawROI() external {
        uint256 amount = roiBalances[msg.sender];
        require(amount > 0, "No ROI available to withdraw");

        roiBalances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit ROIWithdrawn(msg.sender, amount);
    }

    /// @notice Helper to calculate insurance based on budget + farm size
    function calculateInsurance(uint256 _budget, uint256 _farmSize) public pure returns (uint256) {
        // Example formula: 5% of budget + 1% per hectare
        return (_budget * 5 / 100) + (_farmSize * _budget / 100);
    }

    /// @notice Get all farm IDs
    function getAllFarms() external view returns (uint256[] memory) {
        return farmIds;
    }

    /// @notice Get farm details (without mappings)
    function getFarmDetails(uint256 _farmId) external view returns (
        uint256 id,
        address farmer,
        uint256 budget,
        uint256 farmSize,
        uint256 insuranceAmount,
        uint256 totalShares,
        uint256 sharePrice,
        uint256 totalInvested,
        bool isFunded,
        address[] memory investors
    ) {
        Farm storage farm = farms[_farmId];
        return (
            farm.id,
            farm.farmer,
            farm.budget,
            farm.farmSize,
            farm.insuranceAmount,
            farm.totalShares,
            farm.sharePrice,
            farm.totalInvested,
            farm.isFunded,
            farm.investors
        );
    }

    /// @notice Get how much a particular investor invested in a farm
    function getInvestorShares(uint256 _farmId, address _investor) external view returns (uint256) {
        return farms[_farmId].investments[_investor];
    }
}
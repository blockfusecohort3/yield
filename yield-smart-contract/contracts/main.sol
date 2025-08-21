// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract YieldMvp {
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // ------------------ Farmers ------------------
    struct Farmer {
        string firstName;
        string lastName;
        string name;
        string location;
        bool isRegistered;
    }

    mapping(address => Farmer) public farmers;
    address[] public farmerAddresses;

    event FarmerRegistered(address indexed farmerAddress, string firstName, string lastName);

    function registerFarmer(
        string memory _firstName,
        string memory _lastName,
        string memory _location
    ) external {
        require(!farmers[msg.sender].isRegistered, "Farmer already registered");

        farmers[msg.sender] = Farmer({
            firstName: _firstName,
            lastName: _lastName,
            name: string.concat(_firstName, " ", _lastName),
            location: _location,
            isRegistered: true
        });

        farmerAddresses.push(msg.sender);
        emit FarmerRegistered(msg.sender, _firstName, _lastName);
    }

    function getAllFarmers() external view returns (Farmer[] memory) {
        Farmer[] memory result = new Farmer[](farmerAddresses.length);
        for (uint i = 0; i < farmerAddresses.length; i++) {
            result[i] = farmers[farmerAddresses[i]];
        }
        return result;
    }

    // ------------------ Investors ------------------
    struct Investor {
        string firstName;
        string lastName;
        string name;
        string country;
        bool isRegistered;
    }

    mapping(address => Investor) public investors;

    event InvestorRegistered(address indexed investorAddress, string firstName, string lastName);

    function registerInvestor(
        string memory _firstName,
        string memory _lastName,
        string memory _country
    ) external {
        require(!investors[msg.sender].isRegistered, "Investor already registered");

        investors[msg.sender] = Investor({
            firstName: _firstName,
            lastName: _lastName,
            name: string.concat(_firstName, " ", _lastName),
            country: _country,
            isRegistered: true
        });

        emit InvestorRegistered(msg.sender, _firstName, _lastName);
    }

    // ------------------ Farm Investment ------------------
    struct Farm {
        uint256 id;
        address farmer;
        uint256 budget;
        uint256 farmSize;
        uint256 insuranceAmount;
        uint256 totalShares;
        uint256 sharePrice;
        uint256 totalInvested;
        string  description;
        bool isFunded;

        uint256 escrowBalance;
        uint256 farmDurationDays;
        uint256 startTime;
        uint256 milestoneCount;
        uint256 periodSeconds;
        uint256 milestonesReleased;

        address[] investors;
        mapping(address => uint256) investments;
    }

    uint256 public nextFarmId;
    mapping(uint256 => Farm) private farms;
    uint256[] public farmIds;
    mapping(address => uint256) public roiBalances;

    event FarmCreated(uint256 farmId, address farmer, uint256 budget, uint256 farmSize, uint256 insuranceAmount, uint256 durationDays);
    event SharesPurchased(uint256 farmId, address investor, uint256 shares, uint256 amount);
    event RepaymentMade(uint256 farmId, uint256 amount);
    event ROIAllocated(address investor, uint256 amount);
    event ROIWithdrawn(address investor, uint256 amount);
    event MilestoneReleased(uint256 indexed farmId, uint256 milestoneIndex, uint256 amount, uint256 remainingEscrow);

    modifier onlyFarmer(uint256 _farmId) {
        require(farms[_farmId].farmer == msg.sender, "Not the farmer of this farm");
        _;
    }

    // ----- Insurance + helper -----
    function calculateInsurance(uint256 _budget, uint256 _farmSize) public pure returns (uint256) {
        return (_budget * 5 / 100) + (_farmSize * _budget / 100);
    }

    function _deriveSchedule(uint256 durationDays) internal pure returns (uint256 periodSeconds, uint256 milestoneCount) {
        if (durationDays >= 180) {
            periodSeconds = 30 days;
            milestoneCount = (durationDays + 29) / 30;
        } else if (durationDays >= 60) {
            periodSeconds = 14 days;
            milestoneCount = (durationDays + 13) / 14;
        } else {
            periodSeconds = 7 days;
            milestoneCount = (durationDays + 6) / 7;
        }
        if (milestoneCount == 0) milestoneCount = 1;
    }

    // ----- Create farm -----
    function createFarm(
        uint256 _budget,
        uint256 _farmSize,
        uint256 _totalShares,
        uint256 _durationDays,
        string memory _description
    ) external {
        require(farmers[msg.sender].isRegistered, "Farmer not registered");
        require(_budget > 0 && _farmSize > 0 && _totalShares > 0 && _durationDays > 0, "Invalid farm parameters");

        uint256 insuranceAmount = calculateInsurance(_budget, _farmSize);
        uint256 sharePrice = _budget / _totalShares;

        uint256 farmId = nextFarmId++;
        Farm storage farm = farms[farmId];

        farm.id = farmId;
        farm.farmer = msg.sender;
        farm.budget = _budget;
        farm.farmSize = _farmSize;
        farm.insuranceAmount = insuranceAmount;
        farm.totalShares = _totalShares;
        farm.sharePrice = sharePrice;
        farm.description = _description;
        farm.isFunded = false;

        farm.escrowBalance = 0;
        farm.farmDurationDays = _durationDays;
        farm.startTime = 0;
        farm.milestonesReleased = 0;

        (farm.periodSeconds, farm.milestoneCount) = _deriveSchedule(_durationDays);

        farmIds.push(farmId);
        emit FarmCreated(farmId, msg.sender, _budget, _farmSize, insuranceAmount, _durationDays);
    }

    function getAllFarms() external view returns (uint256[] memory) {
        return farmIds;
    }

    // Split getFarmDetails into multiple smaller functions
    function getFarmBasicDetails(uint256 _farmId) external view returns (
        uint256 id,
        address farmerAddr,
        uint256 budget,
        uint256 farmSize,
        uint256 insuranceAmount,
        uint256 totalShares,
        uint256 sharePrice,
        uint256 totalInvested,
        bool isFunded
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
            farm.isFunded
        );
    }

    function getFarmMilestoneDetails(uint256 _farmId) external view returns (
        uint256 escrowBalance,
        uint256 durationDays,
        uint256 milestoneCount,
        uint256 periodSeconds,
        uint256 milestonesReleased,
        uint256 startTime
    ) {
        Farm storage farm = farms[_farmId];
        return (
            farm.escrowBalance,
            farm.farmDurationDays,
            farm.milestoneCount,
            farm.periodSeconds,
            farm.milestonesReleased,
            farm.startTime
        );
    }

    function getFarmInvestors(uint256 _farmId) external view returns (address[] memory) {
        return farms[_farmId].investors;
    }

    function getFarmDescription(uint256 _farmId) external view returns (string memory) {
        return farms[_farmId].description;
    }

    function getInvestorShares(uint256 _farmId, address _investor) external view returns (uint256) {
        return farms[_farmId].investments[_investor];
    }

    // ----- Buy shares -----
    function buyShares(uint256 _farmId, uint256 _amount_shares) external payable {
        Farm storage farm = farms[_farmId];
        require(investors[msg.sender].isRegistered, "Investor not registered");
        require(_amount_shares > 0, "Shares must be > 0");
        require(farm.totalInvested < farm.budget, "Farm fully funded");

        uint256 cost = _amount_shares * farm.sharePrice;
        require(msg.value == cost, "Incorrect payment");

        if (farm.investments[msg.sender] == 0) {
            farm.investors.push(msg.sender);
        }

        farm.investments[msg.sender] += _amount_shares;
        farm.totalInvested += cost;
        farm.escrowBalance += cost;

        if (farm.totalInvested >= farm.budget && !farm.isFunded) {
            farm.isFunded = true;
            farm.startTime = block.timestamp;
            farm.milestonesReleased = 0;
        }

        emit SharesPurchased(_farmId, msg.sender, _amount_shares, cost);
    }

    // ----- Milestone payout -----
    function releaseMilestone(uint256 _farmId) external {
        Farm storage farm = farms[_farmId];
        require(farm.id == _farmId, "FARM_NOT_FOUND");
        require(farm.isFunded, "NOT_FUNDED");
        require(farm.milestonesReleased < farm.milestoneCount, "ALL_RELEASED");

        uint256 nextIndex = farm.milestonesReleased;
        uint256 scheduledTime = farm.startTime + (nextIndex * farm.periodSeconds);
        require(block.timestamp >= scheduledTime, "TOO_EARLY");

        uint256 baseTranche = farm.budget / farm.milestoneCount;
        uint256 amount = nextIndex + 1 == farm.milestoneCount ? farm.escrowBalance : baseTranche;

        farm.milestonesReleased += 1;
        farm.escrowBalance -= amount;

        (bool ok, ) = payable(farm.farmer).call{value: amount}("");
        require(ok, "TRANSFER_FAIL");

        emit MilestoneReleased(_farmId, farm.milestonesReleased, amount, farm.escrowBalance);

        if (farm.milestonesReleased == farm.milestoneCount) {
            farm.isFunded = false;
        }
    }

    // ----- ROI allocation helpers -----
    function _allocateROI(Farm storage farm, uint256 totalRepayment) private {
        uint256 distributed = 0;
        uint256 len = farm.investors.length;

        for (uint256 i = 0; i < len; i++) {
            address investor = farm.investors[i];
            uint256 shares = farm.investments[investor];
            if (shares == 0) continue;

            uint256 investedAmount = shares * farm.sharePrice;
            uint256 amt = (totalRepayment * investedAmount) / farm.totalInvested;

            if (i == len - 1) amt = totalRepayment - distributed;
            else distributed += amt;

            roiBalances[investor] += amt;
            emit ROIAllocated(investor, amt);
        }
    }

    function farmerMakeRepayment(uint256 _farmId) external payable onlyFarmer(_farmId) {
        Farm storage farm = farms[_farmId];
        require(msg.value > 0, "Must repay");
        require(farm.investors.length > 0, "No investors");

        emit RepaymentMade(_farmId, msg.value);
        _allocateROI(farm, msg.value);
    }

    function withdrawROI() external {
        uint256 amount = roiBalances[msg.sender];
        require(amount > 0, "No ROI");

        roiBalances[msg.sender] = 0;
        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "WITHDRAW_FAIL");

        emit ROIWithdrawn(msg.sender, amount);
    }
}
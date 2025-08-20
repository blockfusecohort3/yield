// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title AgroInvestAutoInsurance (MVP)
 * @notice Farmer creates farm (budget + farmSize). Contract estimates insurance using
 *         simple on-chain formula. Farmer chooses shares; investors buy shares (ETH).
 *         Funds are escrowed per farm until fully subscribed (FarmStatus.Funded).
 *
 * Security notes:
 * - Minimal nonReentrant guard included.
 * - This is an MVP: do not store sensitive PII on-chain.
 */
contract AgroInvestAutoInsurance {
    // ---------- Access control ----------
    address public admin;
    modifier onlyAdmin() { require(msg.sender == admin, "NOT_ADMIN"); _; }

    constructor() { admin = msg.sender; }

    function setAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "ZERO_ADDR");
        admin = _newAdmin;
    }

    // ---------- Reentrancy guard ----------
    uint256 private _locked = 1;
    modifier nonReentrant() {
        require(_locked == 1, "REENTRANT");
        _locked = 2;
        _;
        _locked = 1;
    }

    // ---------- Insurance model parameters (configurable by admin) ----------
    // riskFactorBudget is percentage (e.g., 10 means 10%)
    // riskFactorSize is price-per-unit-size (e.g., 1000 wei per hectare)
    uint256 public riskFactorBudget = 10;    // 10%
    uint256 public riskFactorSize = 1000;    // 1000 wei per farm-size unit

    event RiskFactorsUpdated(uint256 riskFactorBudget, uint256 riskFactorSize);

    function updateRiskFactors(uint256 _budgetPct, uint256 _sizeUnit) external onlyAdmin {
        riskFactorBudget = _budgetPct;
        riskFactorSize = _sizeUnit;
        emit RiskFactorsUpdated(_budgetPct, _sizeUnit);
    }

    // ---------- Farm lifecycle ----------
    enum FarmStatus { Created, PendingShares, Active, Funded, Completed, Cancelled }

    struct Farm {
        uint256 id;
        address farmer;
        string crop;
        string location;
        uint256 budget;            // farmer requested (wei)
        uint256 farmSize;          // units (hectares or agreed unit)
        uint256 insuranceEstimate; // calculated by contract
        uint256 totalValue;        // budget + insuranceEstimate
        uint256 totalShares;       // set by farmer
        uint256 sharePrice;        // floor(totalValue / totalShares)
        uint256 sharesSold;
        uint256 escrowBalance;     // wei held from investors
        FarmStatus status;
        // investors
        address[] investorList;
        mapping(address => uint256) sharesOf;
        mapping(address => bool) isInvestor;
    }

    // Storage
    uint256 public farmCount;
    mapping(uint256 => Farm) private farms;

    // ---------- Events ----------
    event FarmCreated(uint256 indexed farmId, address indexed farmer, string crop, uint256 budget, uint256 farmSize);
    event SharesConfigured(uint256 indexed farmId, uint256 totalShares, uint256 sharePrice);
    event Invested(uint256 indexed farmId, address indexed investor, uint256 shares, uint256 amount);
    event FarmFunded(uint256 indexed farmId);
    event RefundIssued(uint256 indexed farmId, address indexed investor, uint256 amount);

    // ---------- Insurance calc (public view) ----------
    /// @notice Calculate insurance estimate using on-chain formula (MVP)
    /// @param _budget wei budget
    /// @param _farmSize farm size units (hectares)
    /// @return estimated insurance in wei
    function calculateInsurance(uint256 _budget, uint256 _farmSize) public view returns (uint256) {
        uint256 fromBudget = (_budget * riskFactorBudget) / 100; // percent
        uint256 fromSize = _farmSize * riskFactorSize;         // per-unit cost
        return fromBudget + fromSize;
    }

    // ---------- Create farm (farmer) ----------
    /// @notice Farmer creates a farm listing; insurance is auto-estimated
    function createFarm(string memory _crop, string memory _location, uint256 _budget, uint256 _farmSize)
        external
        returns (uint256 farmId)
    {
        require(_budget > 0, "BUDGET>0");
        require(_farmSize > 0, "FARMSIZE>0");

        farmId = ++farmCount;
        Farm storage f = farms[farmId];

        f.id = farmId;
        f.farmer = msg.sender;
        f.crop = _crop;
        f.location = _location;
        f.budget = _budget;
        f.farmSize = _farmSize;

        // compute insurance & totals immediately
        f.insuranceEstimate = calculateInsurance(_budget, _farmSize);
        f.totalValue = f.budget + f.insuranceEstimate;

        f.totalShares = 0;
        f.sharePrice = 0;
        f.sharesSold = 0;
        f.escrowBalance = 0;
        f.status = FarmStatus.PendingShares;

        emit FarmCreated(farmId, msg.sender, _crop, _budget, _farmSize);
    }

    // ---------- Farmer sets total shares (derives sharePrice) ----------
    /// @notice Farmer calls to choose how many shares will represent the farm's totalValue.
    function setTotalShares(uint256 _farmId, uint256 _totalShares) external {
        Farm storage f = farms[_farmId];
        require(f.id == _farmId, "FARM_NOT_FOUND");
        require(msg.sender == f.farmer, "NOT_FARMER");
        require(f.status == FarmStatus.PendingShares, "BAD_STATUS");
        require(_totalShares > 0, "SHARES>0");
        require(f.totalValue > 0, "NO_TOTAL_VALUE");

        uint256 price = f.totalValue / _totalShares;
        require(price > 0, "SHARE_PRICE_ZERO");

        f.totalShares = _totalShares;
        f.sharePrice = price;
        f.status = FarmStatus.Active;

        emit SharesConfigured(_farmId, _totalShares, price);
    }

    // ---------- Quote helper ----------
    function quoteSharePrice(uint256 _farmId, uint256 _totalShares) external view returns (uint256) {
        Farm storage f = farms[_farmId];
        require(f.id == _farmId, "FARM_NOT_FOUND");
        require(_totalShares > 0, "SHARES>0");
        return (f.totalValue / _totalShares);
    }

    // ---------- Invest by buying shares (ETH) ----------
    /// @notice Investor buys `_shares` paying exact value (sharePrice * shares)
    function investByShares(uint256 _farmId, uint256 _shares) external payable nonReentrant {
        Farm storage f = farms[_farmId];
        require(f.id == _farmId, "FARM_NOT_FOUND");
        require(f.status == FarmStatus.Active, "NOT_ACTIVE");
        require(_shares > 0, "SHARES>0");
        require(f.sharesSold + _shares <= f.totalShares, "OVER_SUBSCRIBE");

        uint256 cost = _shares * f.sharePrice;
        require(msg.value == cost, "INCORRECT_ETH");

        // record investor
        if (!f.isInvestor[msg.sender]) {
            f.isInvestor[msg.sender] = true;
            f.investorList.push(msg.sender);
        }
        f.sharesOf[msg.sender] += _shares;

        f.sharesSold += _shares;
        f.escrowBalance += msg.value;

        emit Invested(_farmId, msg.sender, _shares, msg.value);

        // if fully subscribed -> Funded
        if (f.sharesSold == f.totalShares) {
            f.status = FarmStatus.Funded;
            emit FarmFunded(_farmId);
        }
    }

    // ---------- Views for frontend ----------
    struct PublicFarm {
        uint256 id;
        address farmer;
        string crop;
        string location;
        uint256 budget;
        uint256 farmSize;
        uint256 insuranceEstimate;
        uint256 totalValue;
        uint256 totalShares;
        uint256 sharePrice;
        uint256 sharesSold;
        uint256 escrowBalance;
        FarmStatus status;
        uint256 investorCount;
    }

    function getFarmPublic(uint256 _farmId) external view returns (PublicFarm memory out) {
        Farm storage f = farms[_farmId];
        require(f.id == _farmId, "FARM_NOT_FOUND");
        out = PublicFarm({
            id: f.id,
            farmer: f.farmer,
            crop: f.crop,
            location: f.location,
            budget: f.budget,
            farmSize: f.farmSize,
            insuranceEstimate: f.insuranceEstimate,
            totalValue: f.totalValue,
            totalShares: f.totalShares,
            sharePrice: f.sharePrice,
            sharesSold: f.sharesSold,
            escrowBalance: f.escrowBalance,
            status: f.status,
            investorCount: f.investorList.length
        });
    }

    function getInvestors(uint256 _farmId) external view returns (address[] memory addrs, uint256[] memory shares) {
        Farm storage f = farms[_farmId];
        require(f.id == _farmId, "FARM_NOT_FOUND");
        uint256 len = f.investorList.length;
        addrs = new address[](len);
        shares = new uint256[](len);
        for (uint256 i = 0; i < len; i++) {
            address inv = f.investorList[i];
            addrs[i] = inv;
            shares[i] = f.sharesOf[inv];
        }
    }

    function remainingShares(uint256 _farmId) external view returns (uint256) {
        Farm storage f = farms[_farmId];
        require(f.id == _farmId, "FARM_NOT_FOUND");
        return (f.totalShares - f.sharesSold);
    }

    // ---------- Simple refund (admin only) - optional utility ----------
    /// @notice Admin can refund an investor for a specific farm (MVP helper)
    function refundInvestor(uint256 _farmId, address _investor) external onlyAdmin nonReentrant {
        Farm storage f = farms[_farmId];
        require(f.id == _farmId, "FARM_NOT_FOUND");
        require(f.isInvestor[_investor], "NOT_INVESTOR");
        uint256 investorShares = f.sharesOf[_investor];
        require(investorShares > 0, "NO_SHARES");

        uint256 amount = investorShares * f.sharePrice;
        // zero out investor record
        f.sharesOf[_investor] = 0;
        f.isInvestor[_investor] = false;

        // remove from investorList is left as improvement (MVP leaves stale entries)
        if (f.escrowBalance >= amount) {
            f.escrowBalance -= amount;
            (bool ok, ) = payable(_investor).call{value: amount}("");
            require(ok, "REFUND_FAIL");
            emit RefundIssued(_farmId, _investor, amount);
        } else {
            revert("INSUFFICIENT_ESCROW");
        }
    }
}

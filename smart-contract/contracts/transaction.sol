// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./Repayment.sol";
import "./Badge.sol";

contract FarmInvestment {
    address public owner;
    Repayment public repaymentContract;
    Badge public badgeContract;
    
    uint256 public totalInvestments;
    uint256 public totalFundsRaised;
    
    enum InvestmentStatus { Active, Completed, Defaulted }
    
    struct Investment {
        uint256 id;
        address farmer;
        address investor;
        uint256 amount;
        uint256 duration;
        uint256 interestRate;
        uint256 startTime;
        InvestmentStatus status;
        uint256 amountRepaid;
    }
    
    mapping(uint256 => Investment) public investments;
    mapping(address => uint256[]) public farmerInvestments;
    mapping(address => uint256[]) public investorInvestments;
    
    event InvestmentCreated(
        uint256 indexed investmentId,
        address indexed farmer,
        address indexed investor,
        uint256 amount,
        uint256 duration,
        uint256 interestRate
    );
    
    event InvestmentFunded(uint256 indexed investmentId, address indexed investor, uint256 amount);
    event InvestmentCompleted(uint256 indexed investmentId);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier validInvestment(uint256 _investmentId) {
        require(_investmentId > 0 && _investmentId <= totalInvestments, "Invalid investment ID");
        _;
    }
    
    constructor(address _repaymentAddress, address _badgeAddress) {
        owner = msg.sender;
        repaymentContract = Repayment(_repaymentAddress);
        badgeContract = Badge(_badgeAddress);
        totalInvestments = 0;
    }
    
    function createInvestment(
        uint256 _amount,
        uint256 _duration,
        uint256 _interestRate
    ) external returns (uint256) {
        require(_amount > 0, "Investment amount must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        require(_interestRate > 0 && _interestRate <= 50, "Interest rate must be between 1-50%");
        
        totalInvestments++;
        
        investments[totalInvestments] = Investment({
            id: totalInvestments,
            farmer: msg.sender,
            investor: address(0),
            amount: _amount,
            duration: _duration,
            interestRate: _interestRate,
            startTime: 0,
            status: InvestmentStatus.Active,
            amountRepaid: 0
        });
        
        farmerInvestments[msg.sender].push(totalInvestments);
        
        emit InvestmentCreated(
            totalInvestments,
            msg.sender,
            address(0),
            _amount,
            _duration,
            _interestRate
        );
        
        return totalInvestments;
    }
    
    function fundInvestment(uint256 _investmentId) external payable validInvestment(_investmentId) {
        Investment storage investment = investments[_investmentId];
        
        require(investment.status == InvestmentStatus.Active, "Investment not active");
        require(investment.investor == address(0), "Investment already funded");
        require(msg.value == investment.amount, "Sent amount must match investment amount");
        
        investment.investor = msg.sender;
        investment.startTime = block.timestamp;
        investorInvestments[msg.sender].push(_investmentId);
        
        payable(investment.farmer).transfer(msg.value);
        
        totalFundsRaised += msg.value;
        
        repaymentContract.initializeRepayment(
            _investmentId,
            investment.amount,
            investment.interestRate,
            investment.duration,
            investment.startTime
        );
        
        emit InvestmentFunded(_investmentId, msg.sender, msg.value);
    }
    
    function getFarmerInvestments(address _farmer) external view returns (uint256[] memory) {
        return farmerInvestments[_farmer];
    }
    
    function getInvestorInvestments(address _investor) external view returns (uint256[] memory) {
        return investorInvestments[_investor];
    }
    
    function getInvestmentDetails(uint256 _investmentId) 
        external 
        view 
        validInvestment(_investmentId) 
        returns (
            address farmer,
            address investor,
            uint256 amount,
            uint256 duration,
            uint256 interestRate,
            uint256 startTime,
            InvestmentStatus status,
            uint256 amountRepaid
        ) 
    {
        Investment memory investment = investments[_investmentId];
        return (
            investment.farmer,
            investment.investor,
            investment.amount,
            investment.duration,
            investment.interestRate,
            investment.startTime,
            investment.status,
            investment.amountRepaid
        );
    }
    

    function updateInvestmentStatus(uint256 _investmentId, InvestmentStatus _status, uint256 _amountRepaid) 
        external 
    {
        require(msg.sender == address(repaymentContract), "Only repayment contract can update status");
        
        Investment storage investment = investments[_investmentId];
        investment.status = _status;
        investment.amountRepaid = _amountRepaid;
        
        if (_status == InvestmentStatus.Completed) {
            emit InvestmentCompleted(_investmentId);
        }
    }
    
    
    function updateContractAddresses(address _repaymentAddress, address _badgeAddress) external onlyOwner {
        repaymentContract = Repayment(_repaymentAddress);
        badgeContract = Badge(_badgeAddress);
    }
    
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
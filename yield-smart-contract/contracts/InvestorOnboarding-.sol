// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract InvestorOnboarding {
    // Owner (admin) of the contract
    address public owner;

    // Restrict function access to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    // Enum for KYC status
    enum KycStatus { Pending, Approved, Rejected }

    // Investor struct
    struct Investor {
        string firstName;
        string lastName;
        string name;
        string country;
        string investorType; // e.g., Individual / Corporate
        bool isRegistered;
        KycStatus status;
    }

    // KYC metadata stored on-chain (hash of submitted docs)
    struct KycInfo {
        string documentHash;  
        uint256 submittedAt;
    }

    // Mapping to store investors by their Ethereum address
    mapping(address => Investor) public investors;
    mapping(address => KycInfo) public investorKyc;

    // Events
    event InvestorRegistered(address indexed investorAddress, string firstName, string lastName);
    event KycSubmitted(address indexed investorAddress, string documentHash);
    event KycUpdated(address indexed investorAddress, KycStatus status);

    // Constructor sets the deployer as owner
    constructor() {
        owner = msg.sender;
    }

    // Investor registers with KYC document hash
    function registerInvestorWithKyc(
        string memory _firstName,
        string memory _lastName,
        string memory _country,
        string memory _investorType,
        string memory _idDocumentHash
    ) external {
        require(!investors[msg.sender].isRegistered, "Investor already registered");

        investors[msg.sender] = Investor({
            firstName: _firstName,
            lastName: _lastName,
            name: string.concat(_firstName, " ", _lastName),
            country: _country,
            investorType: _investorType,
            isRegistered: true,
            status: KycStatus.Pending
        });

        investorKyc[msg.sender] = KycInfo({
            documentHash: _idDocumentHash,
            submittedAt: block.timestamp
        });

        emit InvestorRegistered(msg.sender, _firstName, _lastName);
        emit KycSubmitted(msg.sender, _idDocumentHash);
    }

    // Only owner (oracle/backend after sumsub check) can update KYC status
    function updateKycStatus(address _investor, KycStatus _status) external onlyOwner {
        require(investors[_investor].isRegistered, "Investor not registered");

        investors[_investor].status = _status;

        emit KycUpdated(_investor, _status);
    }

    // View function to get investor info
    function getInvestor(address _investor) external view returns (
        string memory firstName,
        string memory country,
        string memory investorType,
        bool isRegistered,
        KycStatus status
    ) {
        Investor memory i = investors[_investor];
        return (i.firstName, i.country, i.investorType, i.isRegistered, i.status);
    }
}

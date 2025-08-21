// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract FarmerOnboarding {
    // Owner (admin) of the contract
    address public owner;

    //Track farmer addresses
    address[] public farmerAddresses;


    // Restrict function access to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }


    // Farmer struct
    struct Farmer {
        string firstName;
        string lastName;
        string name;
        string location;
        string farmType;
        bool isRegistered;
        // KycStatus status;
    }

    // Mapping to store farmers by their Ethereum address
    mapping(address => Farmer) public farmers;
    // mapping(address => KycInfo) public farmerKyc;

    // Events
    event FarmerRegistered(
        address indexed farmerAddress,
        string firstName,
        string lastName
    );

    // Constructor sets the deployer as owner
    constructor() {
        owner = msg.sender;
    }

    // Farmer registers with KYC document hash
    function registerFarmer(
        string memory _firstName,
        string memory _lastName,
        string memory _location,
        string memory _farmType
        // string memory _idDocumentHash
    ) external {
        require(!farmers[msg.sender].isRegistered, "Farmer already registered");

        farmers[msg.sender] = Farmer({
            firstName: _firstName,
            lastName: _lastName,
            name: string.concat(_firstName, " ", _lastName),
            location: _location,
            farmType: _farmType,
            isRegistered: true
        });


          farmerAddresses.push(msg.sender);
        emit FarmerRegistered(msg.sender, _firstName, _lastName);
        // emit KycSubmitted(msg.sender, _idDocumentHash);
    }


    // View function to get farmer info
    function getFarmer(
        address _farmer
    )
        external
        view
        returns (
            string memory firstName,
            string memory location,
            string memory farmType,
            bool isRegistered
            // KycStatus status
        )
    {
        Farmer memory f = farmers[_farmer];
        return (f.firstName, f.location, f.farmType, f.isRegistered);
    }

function getAllFarmers() external view returns (Farmer[] memory) {
    Farmer[] memory result = new Farmer[](farmerAddresses.length);
    for (uint i = 0; i < farmerAddresses.length; i++) {
        result[i] = farmers[farmerAddresses[i]];
    }
    return result;
}
}

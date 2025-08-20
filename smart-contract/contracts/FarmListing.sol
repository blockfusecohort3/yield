// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract YieldMarketplace {
    enum FarmType { Crop, Animal }
    struct BudgetItem {
        string description;
        uint256 amount;    
    }

    struct Farm {
        uint256 id;
        address owner;
        FarmType farmType;     
        string specificType;   
        uint256 farmSize;      
        string description;    
        BudgetItem[] budget;   
    }

    
    uint256 private nextFarmId;
    mapping(uint256 => Farm) private farms;            
    mapping(address => uint256[]) private ownerToFarms;

    event FarmListed(
        address indexed owner,
        uint256 farmId,
        FarmType farmType,
        string specificType,
        uint256 farmSize,
        string description
    );

    event FarmUpdated(address indexed owner, uint256 farmId);
    event FarmDeleted(address indexed owner, uint256 farmId);
    event BudgetItemAdded(address indexed owner, uint256 farmId, string description, uint256 amount);
    event BudgetItemUpdated(address indexed owner, uint256 farmId, uint256 index, string description, uint256 amount);
    event BudgetItemDeleted(address indexed owner, uint256 farmId, uint256 index);

    function listFarm(
        FarmType _farmType,
        string memory _specificType,
        uint256 _farmSize,
        string memory _description
        ) external {
        uint256 farmId = nextFarmId++;

        Farm storage newFarm = farms[farmId];
        newFarm.id = farmId;
        newFarm.owner = msg.sender;
        newFarm.farmType = _farmType;
        newFarm.specificType = _specificType;
        newFarm.farmSize = _farmSize;
        newFarm.description = _description;

        ownerToFarms[msg.sender].push(farmId);

        emit FarmListed(msg.sender, farmId, _farmType, _specificType, _farmSize, _description);
    }

    function updateFarm(
        uint256 _farmId,
        FarmType _farmType,
        string memory _specificType,
        uint256 _farmSize,
        string memory _description
    ) external {
        Farm storage farm = farms[_farmId];
        require(farm.owner == msg.sender, "Not the farm owner");

        farm.farmType = _farmType;
        farm.specificType = _specificType;
        farm.farmSize = _farmSize;
        farm.description = _description;

        emit FarmUpdated(msg.sender, _farmId);
    }

    function deleteFarm(uint256 _farmId) external {
        Farm storage farm = farms[_farmId];
        require(farm.owner == msg.sender, "Not the farm owner");

        delete farms[_farmId];
        uint256[] storage userFarms = ownerToFarms[msg.sender];
        for (uint i = 0; i < userFarms.length; i++) {
            if (userFarms[i] == _farmId) {
                userFarms[i] = userFarms[userFarms.length - 1];
                userFarms.pop();
                break;
            }
        }

        emit FarmDeleted(msg.sender, _farmId);
    }

    function addBudgetItem(uint256 _farmId, string memory _description, uint256 _amount) external {
        Farm storage farm = farms[_farmId];
        require(farm.owner == msg.sender, "Not the farm owner");

        farm.budget.push(BudgetItem({ description: _description, amount: _amount }));

        emit BudgetItemAdded(msg.sender, _farmId, _description, _amount);
    }

    function updateBudgetItem(uint256 _farmId, uint256 _index, string memory _description, uint256 _amount) external {
        Farm storage farm = farms[_farmId];
        require(farm.owner == msg.sender, "Not the farm owner");
        require(_index < farm.budget.length, "Invalid budget item index");

        farm.budget[_index].description = _description;
        farm.budget[_index].amount = _amount;

        emit BudgetItemUpdated(msg.sender, _farmId, _index, _description, _amount);
    }

    function deleteBudgetItem(uint256 _farmId, uint256 _index) external {
        Farm storage farm = farms[_farmId];
        require(farm.owner == msg.sender, "Not the farm owner");
        require(_index < farm.budget.length, "Invalid budget item index");

        uint256 lastIndex = farm.budget.length - 1;
        if (_index != lastIndex) {
            farm.budget[_index] = farm.budget[lastIndex];
        }
        farm.budget.pop();

        emit BudgetItemDeleted(msg.sender, _farmId, _index);
    }

    function getTotalBudget(uint256 _farmId) external view returns (uint256 total) {
        Farm storage farm = farms[_farmId];
        for (uint i = 0; i < farm.budget.length; i++) {
            total += farm.budget[i].amount;
        }
    }


    function getFarm(uint256 _farmId) external view returns (
        uint256 id,
        address owner,
        FarmType farmType,
        string memory specificType,
        uint256 farmSize,
        string memory description,
        BudgetItem[] memory budget
    ) {
        Farm storage farm = farms[_farmId];
        return (
            farm.id,
            farm.owner,
            farm.farmType,
            farm.specificType,
            farm.farmSize,
            farm.description,
            farm.budget
        );
    }

    function getBudget(uint256 _farmId) external view returns (BudgetItem[] memory) {
        return farms[_farmId].budget;
    }

    function getFarmsByOwner(address _owner) external view returns (uint256[] memory) {
        return ownerToFarms[_owner];
    }
}
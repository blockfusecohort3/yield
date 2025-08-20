// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Ratings {
    uint256 public ratingCount = 0;
    mapping(address => uint256) public ratings;
    mapping(address => uint256) public ratingTotal; 
    mapping(address => uint256) public rateCounts;
    
    
    event RatingAdded(address indexed user, uint256 rating, address indexed rater);
    
    function setRating(uint256 rating, address userAddress) public {
        require(rating >= 1 && rating <= 5, "Rating must be between 1-5");
        require(userAddress != address(0), "Invalid user address");
        require(userAddress != msg.sender, "Cannot rate yourself");
        
        ratingTotal[userAddress] += rating;
        rateCounts[userAddress] += 1;
        
        ratingCount += 1;
        
        emit RatingAdded(userAddress, rating, msg.sender);
    }
    
    function getRating(address _user) public view returns (uint256) {
        return ratingTotal[_user];
    }
    
    function getAverageRating(address _user) public view returns (uint256) {
        require(rateCounts[_user] > 0, "No ratings for this user");
        return ratingTotal[_user] / rateCounts[_user];
    }
    
    function getrateCount(address _user) public view returns (uint256) {
        return rateCounts[_user];
    }

}
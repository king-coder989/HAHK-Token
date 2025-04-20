// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HAHKToken {
    struct Roommate {
        uint256 stake;
        uint256 lastShower;
        bool active;
    }

    address public owner;
    uint256 public minStake = 0.01 ether;
    uint256 public hygieneInterval = 1 days;
    mapping(address => Roommate) public roommates;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function join() external payable {
        require(msg.value >= minStake, "Insufficient stake");
        require(!roommates[msg.sender].active, "Already joined");
        roommates[msg.sender] = Roommate(msg.value, block.timestamp, true);
    }

    function logShower() external {
        require(roommates[msg.sender].active, "Not a roommate");
        roommates[msg.sender].lastShower = block.timestamp;
    }

    function slashLazy(address user) external onlyOwner {
        require(roommates[user].active, "Not active");
        require(block.timestamp - roommates[user].lastShower > hygieneInterval, "Still clean");
        
        uint256 penalty = roommates[user].stake / 2;
        roommates[user].stake -= penalty;
        payable(owner).transfer(penalty); // owner gets slashed funds as gas fee reward
    }

    function rewardClean(address user) external onlyOwner {
        require(roommates[user].active, "Not active");
        require(block.timestamp - roommates[user].lastShower <= hygieneInterval, "Not clean");

        uint256 reward = 0.01 ether;
        roommates[user].stake += reward;
    }

    function exit() external {
        require(roommates[msg.sender].active, "Not active");
        require(block.timestamp - roommates[msg.sender].lastShower <= hygieneInterval, "Too dirty to leave");

        uint256 refund = roommates[msg.sender].stake;
        roommates[msg.sender].active = false;
        roommates[msg.sender].stake = 0;
        payable(msg.sender).transfer(refund);
    }

    // Fallback to receive ETH
    receive() external payable {}
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract DonationFounding is ERC20, Ownable {
    uint256 public totalFunds;
    mapping(address => uint256) public contributions;
    address[] public donors;

    modifier hasSufficientFunds() {
        require(msg.value > 0, "Donation must be greater than 0");
        console.log("Sender Balance: ", msg.sender.balance);
        console.log("Message sender: ", msg.sender);
        console.log("Message value: ", msg.value);
        require(msg.sender.balance >= msg.value, "Insufficient funds balance!");
        _;
    }

    event DonationReceived(address indexed donor, uint256 amount);

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) Ownable(msg.sender) {

    }

    function donate() hasSufficientFunds public payable {
        console.log("Owner: ", owner());
        _mint(msg.sender, msg.value);
        console.log("HERE AFTER");
        contributions[msg.sender] += msg.value;
        donors.push(msg.sender);
        totalFunds += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    function getDonors() public view returns (address[] memory) {
        return donors;
    }

    function getTotalFunds() public view returns (uint256) {
        return totalFunds;
    }

    // function calculateBestDoner(string[] donors, mapping(address => uint256) storage donations) internal pure returns (address) {
    //     address bestDonor = address(0);
    //     uint256 maxDonation = 0;
    //     for (uint256 i = 0; i < donors.length; i++) {
    //         if (contributions[donors[i]] > maxDonation) {
    //             maxDonation = contributions[donors[i]];
    //             bestDonor = donors[i];
    //         }
    //     }
    //     return bestDonor;
    // }

    // function getBestDonor() public view returns (address) {
    //     return calculateBestDoner(donors, contributions);
    // }
}

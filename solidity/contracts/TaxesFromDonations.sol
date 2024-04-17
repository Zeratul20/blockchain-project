// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract TaxesFromDonations is ERC20, Ownable {
    uint256 private totalTaxes;

    event TaxReceived(address indexed donationFound, uint256 amount);

    modifier taxPositive() {
        require(msg.value > 0, "Tax must be greater than 0");
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
    }

    function claculateTax(uint256 amount) public pure returns (uint256) {
        return amount / 10;
    }

    function tax() public payable taxPositive() {
        payable(owner()).transfer(msg.value);
        console.log("AFter transfer: ");
        totalTaxes += msg.value;
        emit TaxReceived(msg.sender, msg.value);
    }

    function getTotalTaxes() public view returns (uint256) {
        return totalTaxes;
    }
}

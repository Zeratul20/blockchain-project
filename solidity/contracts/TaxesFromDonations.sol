// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.19 <0.9.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract TaxesFromDonations is ERC20, Ownable {
    uint256 private totalTaxes;

    event TaxReceived(address indexed donationFound, uint256 amount);

    modifier taxPositive(uint256 amount) {
        require(amount > 0, "Tax must be greater than 0");
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

    function tax(uint256 amount) public payable taxPositive(amount) {
        require(amount > 0, "Tax must be greater than 0");
        uint256 taxAmount = claculateTax(amount);
        console.log("Tax Amount: ", taxAmount);
        payable(owner()).transfer(taxAmount);
        console.log("AFter transfer: ");
        totalTaxes += taxAmount;
        emit TaxReceived(msg.sender, taxAmount);
    }

    function getTotalTaxes() public view returns (uint256) {
        return totalTaxes;
    }
}

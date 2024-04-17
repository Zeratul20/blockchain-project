// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./DonationFounding.sol";
import "hardhat/console.sol";
import "./TaxesFromDonations.sol";

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TaxesFromDonations.sol";

contract CrowdFounding is DonationFounding {
    uint256 public goal;
    uint256 public deadline;
    TaxesFromDonations taxesFromDonations;
    bool public ended;

    event FundingGoalReached(uint256 totalFunds);
    event FundingClosed(uint256 totalFunds);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 _goal,
        uint256 _deadline,
        TaxesFromDonations _taxesFromDonations
    ) DonationFounding(name_, symbol_) {
        goal = _goal;
        deadline = block.timestamp + _deadline;
        taxesFromDonations = TaxesFromDonations(_taxesFromDonations);
    }

    modifier fundingActive() {
        require(block.timestamp < deadline, "Funding campaign has ended!");
        _;
    }

    function fund() public payable fundingActive {
        super.donate();
    }

    function checkGoalReached() public onlyOwner returns (bool) {
        require(!ended, "Funding campaign has ended!");
        require(
            block.timestamp >= deadline,
            "Funding campaign is still active!"
        );
        if (totalFunds >= goal) {
            ended = true;
            uint256 calculatedTax = taxesFromDonations.claculateTax(totalFunds);
            taxesFromDonations.tax{value: calculatedTax}();
            emit FundingGoalReached(totalFunds);
            return true;
        } else {
            ended = true;
            withdrawFunds();
            emit FundingClosed(totalFunds);
            return false;
        }
    }

    function withdrawFunds() public onlyOwner {
        require(ended, "Funding campaign has not ended!");
        require(totalFunds < goal, "Funding goal reached!");
        // Transfer to the initial senders
        // Iterate through dfonations mapping

        for (uint256 i = 0; i < donors.length; i++) {
            address payable receiver = payable(donors[i]);
            receiver.transfer(contributions[donors[i]]);
            contributions[donors[i]] = 0;
        }
    }
}

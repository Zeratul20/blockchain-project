import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import web3 from "web3";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { toast } from "react-toastify";

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const taxesContractAddress = "0x811707f2affEe6A72C379D15fCa1802A3a1573f8";
const crowdFundingContractAddress =
  "0xa779fC68B636c3e57d610002A9a3C9b4289fC6A3";

const taxesContractAbi = [
  "modifier taxPositive(uint256 amount)",
  "function claculateTax(uint256 amount) public pure returns (uint256)",
  "function tax(uint256 amount) external taxPositive(amount)",
  "function getTotalTaxes() public view returns (uint256)",
];

const taxesContract = new ethers.Contract(
  taxesContractAddress,
  taxesContractAbi,
  provider
);

const crowdFundingContractAbi = [
  "uint256 public totalFunds",
  "function getTotalFunds() public view returns (uint256)",
  "modifier fundingActive()",
  "function fund() public payable",
  "function checkGoalReached() public payable returns (bool)",
  "function withdrawFunds() public onlyOwner",
];

const crowdFundingContract = new ethers.Contract(
  crowdFundingContractAddress,
  crowdFundingContractAbi,
  provider
);

const totalFunds = async () => {
  const totalFunds = await crowdFundingContract.getTotalFunds();
  console.log("Total funds: ", parseInt(totalFunds));
  return parseInt(totalFunds);
};

export const MainPage = () => {
  const [taxes, setTaxes] = useState(0);
  const [taxInput, setTaxInput] = useState(0);
  const [calculatedTax, setCalculatedTax] = useState(0);
  const [totalValFunds, setTotalValFunds] = useState(0);
  const [donation, setDonation] = useState("");

  // useEffect(() => {
  //   totalFunds().then((res) => setTotalValFunds(res));
  // });

  const handleGetTaxes = async () => {
    const totalTaxes = await taxesContract.getTotalTaxes();
    console.log("Total taxes: ", parseInt(totalTaxes));
    setTaxes(parseInt(totalTaxes));
    toast.success("Taxes value obtained successfully", {
      position: "top-center",
      autoClose: 3000,
    });
  };
  const handleCalculateTax = async (input) => {
    try {
      const claculateTax = await taxesContract.claculateTax(input);
      console.log("claculateTax: ", parseInt(claculateTax));
      setCalculatedTax(parseInt(claculateTax));
      toast.success("Tax calculated successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      if (error.message.includes("out-of-bounds"))
        toast.error("Negative Value", {
          position: "top-center",
          autoClose: 3000,
        });
      else {
        toast.error("Invalid Value", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  const handleGetTotalFunds = async () => {
    try {
      const totalFunds = await crowdFundingContract.getTotalFunds();
      console.log("Total funds: ", parseInt(totalFunds));
      setTotalValFunds(parseInt(totalFunds));
      toast.success("Total funds obtained successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Some error occured", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleDonate = async (input) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const donation = await crowdFundingContract.connect(signer).fund({
        value: ethers.parseEther(input),
      });
      console.log("Donation: ", donation);
      toast.success("Donation success", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      if (error.message.includes("Funding campaign has ended!"))
        toast.error("Funding campaign has ended!", {
          position: "top-center",
          autoClose: 3000,
        });
      else if (error.message.includes("insufficient funds"))
        toast.error("Insufficient funds balance!", {
          position: "top-center",
          autoClose: 3000,
        });
      else
        toast.error("Donation failed", {
          position: "top-center",
          autoClose: 3000,
        });
    }
  };

  const handleGoalReached = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const checkIfGoalReached = await crowdFundingContract
        .connect(signer)
        .checkGoalReached();
      console.log("Check Goal Reached: ", checkIfGoalReached);
      if (checkIfGoalReached)
        toast.success("Goal Reach Checked", {
          position: "top-center",
          autoClose: 3000,
        });
      else
        toast.warn("Goal not reached", {
          position: "top-center",
          autoClose: 3000,
        });
    } catch (error) {
      console.log("Error: ", error);
      if (error.message.includes("Ownable"))
        toast.error("Ownable error", {
          position: "top-center",
          autoClose: 3000,
        });
      else if (error.message.includes("Funding campaign has ended!"))
        toast.error("Funding campaign has ended!", {
          position: "top-center",
          autoClose: 3000,
        });
      else if (error.message.includes("Funding campaign is still active!"))
        toast.error("Funding campaign is still active!", {
          position: "top-center",
          autoClose: 3000,
        });
      else
        toast.error("Some error occured", {
          position: "top-center",
          autoClose: 3000,
        });
    }
  };

  return (
    <div style={{ marginLeft: "20px" }}>
      <h1 className="text-align-center">CrowdFunding Donations Project</h1>
      <h2 style={{ textAlign: "center" }}>Taxes Contracts</h2>
      <p>Taxes contract address: {taxesContractAddress}</p>
      <p>Crowd Funding contract address: {crowdFundingContractAddress}</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleGetTaxes}
      >
        Get Taxes
      </button>
      <p>
        Total taxes: <strong>{taxes}</strong>
      </p>
      <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
        {">>>>>>>>>>>>>>>"}
      </div>
      <div style={{ display: "flex" }}>
        <input
          className="form-control"
          placeholder="Enter tax amount"
          style={{ width: "200px" }}
          onChange={(e) => setTaxInput(parseInt(e.target.value))}
        />
        <button
          type="button"
          className="btn btn-primary pl-3"
          style={{ marginLeft: "15px" }}
          disabled={taxInput === 0}
          onClick={() => handleCalculateTax(taxInput)}
        >
          Calculate Tax
        </button>
      </div>
      <p>
        Calculated Tax: <strong>{calculatedTax}</strong>
      </p>
      <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
        {">>>>>>>>>>>>>>>"}
      </div>

      <h2 style={{ textAlign: "center" }}>Crowd Funding</h2>
      {/* <p>
        Total Funds: <strong>{totalValFunds}</strong>
      </p> */}
      <div style={{ display: "flex" }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleGetTotalFunds}
        >
          Get Total Funds
        </button>
      </div>
      <p>
        Total Funds: <strong>{totalValFunds}</strong>
      </p>
      <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
        {">>>>>>>>>>>>>>>"}
      </div>
      <div style={{ display: "flex" }}>
        <input
          className="form-control"
          placeholder="Enter tax amount"
          style={{ width: "200px" }}
          onChange={(e) => setDonation(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleDonate(donation)}
        >
          Donate
        </button>
      </div>
      <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
        {">>>>>>>>>>>>>>>"}
      </div>
      <div style={{ display: "flex" }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleGoalReached}
        >
          Check goal reached
        </button>
      </div>
    </div>
  );
};

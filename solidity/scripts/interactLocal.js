require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function interact() {

  const [fundOwnerSigner, taxesOwnerSigner, user1, user2] = await ethers.getSigners();

  console.log("Fund owner address: ", fundOwnerSigner.address);
  console.log("Taxes owner address: ", taxesOwnerSigner.address);
  console.log("User1 address: ", user1.address);
  console.log("User2 address: ", user2.address);


  let deployedTaxesFromDonationsAddress = "0x71C95911E9a5D330f4D621842EC243EE1343292e";
  let taxesFromDonations = await ethers.getContractAt(
    "TaxesFromDonations",
    deployedTaxesFromDonationsAddress
  );

  let deployedCrowdFoundingAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  let crowdFounding = await ethers.getContractAt(
    "CrowdFounding",
    deployedCrowdFoundingAddress
  );

  let overwrite = {
    value: ethers.utils.parseEther("0.01"),
  };

  // let crowdFundingTx = await crowdFounding.connect(user1).fund(overwrite);
  // await crowdFundingTx.wait();
  // console.log("Funded user1");

  // let overwrite2 = {
  //   value: ethers.utils.parseEther("0.02"),
  // };

  // let crowdFunding2Tx = await crowdFounding.connect(user2).fund(overwrite2);
  // await crowdFunding2Tx.wait();
  // console.log("Funded user2");

  let totalFunds = await crowdFounding.getTotalFunds();
  console.log("Total funds: ", totalFunds.toString());
  
  let checkGoalReachedTx = await crowdFounding.connect(fundOwnerSigner).checkGoalReached();
  await checkGoalReachedTx.wait();
  console.log("Checked goal reached");
  
  
  
  
  
  // let totalTaxes = await taxesFromDonations.getTotalTaxes();
  // console.log("Total taxes: ", totalTaxes.toString());



  // let claculatedTax = await taxesFromDonations.claculateTax(ethers.utils.parseEther("0.00001"));
  // console.log("Calculated tax: ", claculatedTax.toString());
}

interact()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

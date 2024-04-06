require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function interact() {
  [fundOwner, taxesOwner, user1, user2, user3] = await ethers.getSigners();

  let deployedTaxesFromDonationsAddress = "";
  let taxesFromDonations = await ethers.getContractAt(
    "TaxesFromDonations",
    deployedTaxesFromDonationsAddress
  );

  let deployedCrowdFoundingAddress = "";
  let crowdFounding = await ethers.getContractAt(
    "CrowdFounding",
    deployedCrowdFoundingAddress
  );

  let overwrite = {
    value: ethers.utils.parseEther("1"),
  };

  let crowdFundingTx = await crowdFounding.connect(user1).fund(overwrite);
  await crowdFundingTx.wait();
  console.log("Funded user1");

  let overwrite2 = {
    value: ethers.utils.parseEther("2"),
  };

  let crowdFunding2Tx = await crowdFounding.connect(user2).fund(overwrite2);
  await crowdFunding2Tx.wait();
  console.log("Funded user2");

  let totalTaxes = await taxesFromDonations.getTotalTaxes();
  console.log("Total taxes: ", totalTaxes.toString());
}

interact()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

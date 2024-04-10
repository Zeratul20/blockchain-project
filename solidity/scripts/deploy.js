require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
  [fundOwner, taxesOwner] = await ethers.getSigners();

  let taxesFromDonationsFactory = await ethers.getContractFactory(
    "TaxesFromDonations"
  );
  let taxesFromDonations = await taxesFromDonationsFactory
    .connect(taxesOwner)
    .deploy("TaxesFromDonations", "LEU");
  await taxesFromDonations.deployed();
  console.log("taxesFromDonations address: ", taxesFromDonations.address);

  let crowdFoundingFactory = await ethers.getContractFactory("CrowdFounding");
  let crowdFounding = await crowdFoundingFactory
    .connect(fundOwner)
    .deploy("CrowdFounding", "LEU", 1e10, 1000 * 60, taxesFromDonations.address);
  await crowdFounding.deployed();
  console.log("crowdFounding address: ", crowdFounding.address);
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

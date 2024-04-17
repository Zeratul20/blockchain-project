require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
  const [fundOwnerSigner, taxesOwnerSigner, user1, user2] = await ethers.getSigners();

  let taxesFromDonationsFactory = await ethers.getContractFactory(
    "TaxesFromDonations"
  );
  let taxesFromDonations = await taxesFromDonationsFactory
    .connect(taxesOwnerSigner)
    .deploy("TaxesFromDonations", "LEU");
  await taxesFromDonations.deployed();
  console.log("taxesFromDonations address: ", taxesFromDonations.address);

  let crowdFoundingFactory = await ethers.getContractFactory("CrowdFounding");
  let crowdFounding = await crowdFoundingFactory
    .connect(fundOwnerSigner)
    .deploy(
      "CrowdFounding",
      "LEU",
      1e10,
      60,
      taxesFromDonations.address
    );
  await crowdFounding.deployed();
  console.log("crowdFounding address: ", crowdFounding.address);

  let approvedCrowdOwner = await crowdFounding.connect(fundOwnerSigner).approve(fundOwnerSigner.address, ethers.utils.parseEther("1"));
  let approvedCrowdSender1 = await crowdFounding.connect(fundOwnerSigner).approve(user1.address, ethers.utils.parseEther("1"));
  let approvedCrowdSender2 = await crowdFounding.connect(fundOwnerSigner).approve(user2.address, ethers.utils.parseEther("1"));
  await approvedCrowdOwner.wait();
  await approvedCrowdSender1.wait();
  await approvedCrowdSender2.wait();
  console.log("Approved crowd funding");
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

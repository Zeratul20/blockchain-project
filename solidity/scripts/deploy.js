require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
  // const [fundOwnerSigner, taxesOwnerSigner] = await ethers.getSigners();

  const fundOwnerAddress = "0x1b5b0a22AAc98F35291896815AE0e966bd2415B6"
  const taxesOwnerAddress = "0x9d5c7802ff8e22E3eF84dFd191f933E1cf5F5B61"

  const fundOwnerSigner = ethers.provider.getSigner(fundOwnerAddress);
  const taxesOwnerSigner = ethers.provider.getSigner(taxesOwnerAddress);

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
      180,
      taxesFromDonations.address
    );
  await crowdFounding.deployed();
  console.log("crowdFounding address: ", crowdFounding.address);
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

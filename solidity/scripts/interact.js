require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function interact() {

  const fundOwnerAddress = "0x1b5b0a22AAc98F35291896815AE0e966bd2415B6"
  const taxesOwnerAddress = "0x9d5c7802ff8e22E3eF84dFd191f933E1cf5F5B61"
  const user1Address = "0xad64657b2c10352d2430fBF55Dc404Ca9f6Eb730"
  const user2Address = "0x212095520080EB40627E40D35C059c56675CE443"

  const fundOwnerSigner = ethers.provider.getSigner(fundOwnerAddress);
  const taxesOwnerSigner = ethers.provider.getSigner(taxesOwnerAddress);
  const user1 = ethers.provider.getSigner(user1Address);
  const user2 = ethers.provider.getSigner(user2Address);

  let deployedTaxesFromDonationsAddress = "0x51cf30A3158592dC81C5eAD79161ADbE05482640";
  let taxesFromDonations = await ethers.getContractAt(
    "TaxesFromDonations",
    deployedTaxesFromDonationsAddress
  );

  let deployedCrowdFoundingAddress = "0x49C90A1fC6EeFac668DFC54a133FA361E9A597b8";
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
  
  // let checkGoalReachedTx = await crowdFounding.connect(fundOwnerSigner).checkGoalReached();
  // await checkGoalReachedTx.wait();
  // console.log("Checked goal reached");
  
  
  
  
  
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

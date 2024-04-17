const {ethers} = require("hardhat");
const common = require("./common.js");
const { expect } = require("chai");

describe("Crowd founding", function () {
    let fundOwnerSigner, taxesOwnerSigner, user1, user2;
    let taxesContract, crowdFoundingContract;

    before(async function () {
        await ethers.provider.send("hardhat_setLoggingEnabled", [false]);
        await common.init()

        fundOwnerSigner = common.fundOwnerSigner()
        taxesOwnerSigner = common.user1()
        user1 = common.user1()
        user2 = common.user2()
    })

    beforeEach(async function () {
        let taxesFactory = await ethers.getContractFactory("TaxesFromDonations")
        let taxes = await taxesFactory.deploy("TaxesFromDonations", "LEU")
        await taxes.deployed()
        taxesContract = taxes;

        let crowdFoundingFactory = await ethers.getContractFactory("CrowdFounding")
        let crowdFounding = await crowdFoundingFactory.deploy("CrowdFounding", "LEU", 1e10, 30, taxesContract.address)
        await crowdFounding.deployed()
        crowdFoundingContract = crowdFounding;
    })

    it("Should end a game smoothly", async function () {
        let amount =  { value: ethers.utils.parseEther("0.05")}
        let transferTx = await crowdFoundingContract.connect(user1).fund(amount)
        await transferTx.wait()

        let crowdFoundingBalance = await crowdFoundingContract.getTotalFunds()
        await expect(crowdFoundingBalance.toString()).to.be.equal(amount.value.toString());
    
        let amount2 = { value: ethers.utils.parseEther("0.05")}
        let transfer2Tx = await crowdFoundingContract.connect(user2).fund(amount2)
        await transfer2Tx.wait()

        let amount3 = { value: ethers.utils.parseEther("0.1")}
        crowdFoundingBalance = await crowdFoundingContract.getTotalFunds()
        await expect(crowdFoundingBalance.toString()).to.be.equal(amount3.value.toString())
        
        setTimeout(async() => {
            let checkGoalReachedTx = await crowdFoundingContract.connect(fundOwnerSigner).checkGoalReached();
            await checkGoalReachedTx.wait();
            
            let amount4 = { value: ethers.utils.parseEther("0.01")}
            let totalTaxes = await taxesContract.getTotalTaxes();
            expect(totalTaxes.toString()).to.be.equal(amount4.value.toString())
        }, 31 * 1000)
    })
})
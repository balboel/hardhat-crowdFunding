const { expect } = require("chai");
const { ethers } = require("hardhat");

let campaignFactory;
let campaign;
let owner;
let addr1;
let addr2;

beforeEach(async () => {
    // deploy CampaignFactory contract
    const [ownerSign, user1, user2] = await ethers.getSigners();
    owner = ownerSign;
    addr1 = user1;
    addr2 = user2;

    const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
    campaignFactory = await CampaignFactory.deploy();

    const Campaign = await ethers.getContractFactory("Campaign");
    campaign = await Campaign.deploy(100, owner.address);
});

describe("Campaigns", async () => {
    it("deploy factory and campaign", async () => {
        expect(await campaignFactory.getDeployedCampaigns()).to.have.lengthOf(
            0
        );
        expect(campaign).to.exist;
    });

    it("create campaign with expected value", async () => {
        const manager = await campaign.manager();
        const approversCount = await campaign.approversCount();
        const minContribution = await campaign.minimumContribution();

        expect(minContribution).to.equal(100);
        expect(manager).to.equal(owner.address);
        expect(approversCount).to.equal(0);
    });

    it("allows to contribute and push it to approvers", async () => {
        await campaign.connect(addr1).contribute({ value: 200 });

        const isContributor = await campaign.approvers(addr1.address);
        expect(isContributor).to.be.true;
    });

    it("requires minimum contribution", async () => {
        try {
            await campaign.connect(addr1).contribute({ value: 99 });
            expect(false);
        } catch (err) {
            expect(err);
        }
    });

    it("allows manager to create request", async () => {
        await campaign
            .connect(owner)
            .createRequest("Buy 3D printer", "1000", addr2);

        const request = await campaign.requests(0);
        expect(request.description).to.equal("Buy 3D printer");
    });

    it("processes requests", async () => {
        await campaign
            .connect(owner)
            .contribute({ value: ethers.utils.parseUnits("10", "ether") });

        await campaign
            .connect(owner)
            .createRequest(
                "Buy 5 computers",
                ethers.utils.parseUnits("5", "ether"),
                addr2
            );

        await campaign.connect(owner).approveRequest(0);
        await campaign.connect(owner).finalizeRequest(0);

        let accountBalance = await provider.getBalance(addr2.address); //account balance type is string
        expect(accountBalance).to.greaterThan(
            ethers.utils.parseUnits("102", "ether")
        );
    });
});

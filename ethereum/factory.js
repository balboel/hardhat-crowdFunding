import web3 from "./web3";
import CampaignFactory from "../artifacts/ethereum/contracts/Campaign.sol/CampaignFactory.json";

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    "0xA891c5A955548Cb756B309D220988193BbDcFC08"
);

export default instance;
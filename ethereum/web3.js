require("dotenv").config();
import Web3 from "web3";

let web3;

const SEPOLIA_API_KEY = process.env.SEPOLIA_API_KEY;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_API_KEY}`
  );
  web3 = new Web3(provider);
}

export default web3;
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const SEPOLIA_API_KEY = process.env.SEPOLIA_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },

    paths: {
        sources: "./ethereum/contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
      },

    defaultNetwork: "hardhat",
    networks: {
        hardhat: {},
        sepolia: {
            url: `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_API_KEY}`,
            accounts: [PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
};

const path = require("path");
const fs = require("fs");

module.exports = async function contractData(contractFileName) {
    const filePath = path.resolve(
        __dirname,
        "artifacts/contracts/Campaign.sol",
        `${contractFileName}.json`
    );
    const src = fs.readFileSync(filePath, "utf8");
    return await JSON.parse(src);
};

const hre = require("hardhat");

async function main() {
    const electionName = "General Election 2026";

    console.log(`Deploying Voting contract with election: "${electionName}"...`);

    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy(electionName);

    await voting.waitForDeployment();

    const address = await voting.getAddress();
    console.log(`✅ Voting contract deployed to: ${address}`);
    console.log(`   Election Name: ${electionName}`);

    // Write the deployed address to a JSON file for the frontend
    const fs = require("fs");
    const path = require("path");
    const contractData = {
        address: address,
        network: hre.network.name,
        electionName: electionName,
        deployedAt: new Date().toISOString(),
    };

    const outputDir = path.join(__dirname, "..", "deployed");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(
        path.join(outputDir, "contract-address.json"),
        JSON.stringify(contractData, null, 2)
    );
    console.log(`📄 Contract address saved to deployed/contract-address.json`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

import { ethers } from "hardhat";

async function main() {
  console.log("Deploying YieldMvp contract...");

  // Get the contract factory - use correct contract name
  const YieldMvp = await ethers.getContractFactory("YieldMvp");

  // Deploy (no constructor args in your contract)
  const yieldMvp = await YieldMvp.deploy();

  // Wait for deployment
  await yieldMvp.waitForDeployment();

  // Get deployed address
  console.log(`YieldMvp deployed at: ${await yieldMvp.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
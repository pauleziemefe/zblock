const hre = require("hardhat");

async function main() {
  const ZBlock = await hre.ethers.getContractFactory("ZBlock");
  const zBlock = await ZBlock.deploy();

  await zBlock.deployed();

  console.log(`Contract Address: ${zBlock.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

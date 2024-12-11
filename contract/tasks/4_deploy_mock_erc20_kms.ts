import { task } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
import { ContractFactory } from "ethers";
import { getSigner } from "../utils/getKmsSinger";

task("deploy:deploy-ft-kms", "Deploy ERC20 Token Contract")
  .addParam("contract", "Contract Name")
  .addParam("networks", "Networks")
  .setAction(async (args, hre) => {
    const { contract, networks } = args;

    try {
      // Get Signer
      const signer = await getSigner(networks);
      console.log("Signer Address:", await signer.getAddress());
      return;

      // Deploy ERC20 token contract
      const proxy = await deployFTContract(hre, contract, signer, []);

      console.log("🚀 ERC20 Token (Proxy) deployed to:", await proxy.getAddress());
    } catch (error) {
      console.error("Error deploying ERC20 token contract:", error);
    }
  });

async function deployFTContract(hre: any, contractName: string, signer: any, params: any[]) {
  const factory = (await hre.ethers.getContractFactory(contractName, signer)) as ContractFactory;
  const proxy = await hre.upgrades.deployProxy(factory, params, { initializer: "initialize" });
  await proxy.waitForDeployment();
  return proxy;
}


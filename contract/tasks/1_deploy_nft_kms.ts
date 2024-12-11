import { task } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
import { ContractFactory } from "ethers";
import { getSigner } from "../utils/getKmsSinger";

task("deploy:deploy-nft-kms", "Deploy NFT Contract")
  .addParam("contract", "Contract Name")
  .addParam("name", "NFT Name")
  .addParam("symbol", "NFT Symbol")
  .addParam("uri", "Base URI")
  .addParam("networks", "Networks")
  .setAction(async (args, hre) => {
    const { contract, name, symbol, uri, networks } = args;

    try {
      // Signerの取得
      const signer = await getSigner(networks);
      console.log("Signer Address:", await signer.getAddress());

      // NFTコントラクトのデプロイ
      const proxy = await deployNFTContract(hre, contract, signer, [name, symbol, uri]);

      console.log("🚀 NFT (Proxy) deployed to:", await proxy.getAddress());
    } catch (error) {
      console.error("Error deploying NFT contract:", error);
    }
  });

async function deployNFTContract(hre: any, contractName: string, signer: any, params: any[]) {
  const factory = (await hre.ethers.getContractFactory(contractName, signer)) as ContractFactory;
  const proxy = await hre.upgrades.deployProxy(factory, params, { initializer: "initialize" });
  await proxy.waitForDeployment();
  return proxy;
}

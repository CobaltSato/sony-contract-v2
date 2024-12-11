import { task } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
import { ContractFactory } from "ethers";
import { getSigner } from "../utils/getKmsSinger";

task("deploy:deploy-gateway-kms", "Deploy Gateway Contract")
  .addParam("contract", "Contract Name")
  .addParam("networks", "Networks")
  .setAction(async (args, hre) => {
    const { contract, networks } = args;

    try {
      // Signerの取得
      const signer = await getSigner(networks);
      console.log("Signer Address:", await signer.getAddress());

      // コントラクトのデプロイ
      const deployedContract = await deployContract(hre, contract, signer);

      console.log("Contract deployed at:", await deployedContract.getAddress());
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  });

/**
 * コントラクトをデプロイするユーティリティ関数
 * @param hre Hardhat Runtime Environment
 * @param contractName コントラクト名
 * @param signer サイナー
 * @returns デプロイ済みコントラクト
 */
async function deployContract(hre: any, contractName: string, signer: any) {
  const factory = (await hre.ethers.getContractFactory(contractName, signer)) as ContractFactory;
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  return contract;
}


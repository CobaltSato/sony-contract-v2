import { task } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
import { ContractFactory } from "ethers";
import { getSigner } from "../utils/getKmsSinger";

task("deploy:deploy-payment-gateway-kms", "Deploy Gateway Contract")
  .addParam("contract", "Contract Name")
  .addParam("networks", "Networks")
  .setAction(async (args, hre) => {
    const { contract, networks } = args;

    try {
      // Signerの取得
      const signer = await getSigner(networks);
      const address = await signer.getAddress()
      console.log("Signer Address:", address);

      // コントラクトのデプロイ
      const deployedContract = await deployContract(hre, contract,address, signer);

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
async function deployContract(hre: any, contractName: string, address: string, signer: any) {
  const factory = (await hre.ethers.getContractFactory(contractName, signer)) as ContractFactory;
  const contract = await factory.deploy(address, 300);
  await contract.waitForDeployment();
  return contract;
}


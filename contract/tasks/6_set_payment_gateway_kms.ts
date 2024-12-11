import { task } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
import "dotenv/config";
import { HeavenlyGuitarsPaymentGateway, HeavenlyGuitarsPaymentGateway__factory } from "../typechain-types";
import { MyToken } from "../typechain-types";
import { getSigner } from "../utils/getKmsSinger";
import { ethers } from "ethers";

task("set:set-payment-gateway-kms", "Set gateway configuration.")
  .addParam("gateway", "Gateway Address")
  .addParam("ft", "ft Address")
  .addParam("networks", "Networks")
  .addParam("type", "NFT Type")
  .setAction(async (args, hre) => {
    const { gateway, networks, type, ft } = args;

    try {
      const signer = await getSigner(networks);
      const signerAddress = await signer.getAddress();
      console.log("Signer Address:", signerAddress);

      const gatewayContract = await attachContract<HeavenlyGuitarsPaymentGateway>(
        hre,
        "HeavenlyGuitarsPaymentGateway",
        gateway,
        signer
      );

      // GatewayにNFTのアドレスを設定
      await gatewayContract.setERC20Addresses([type], [ft]);

      // 初回実行かどうかのチェック
      const isFirstExecution = false;
      const OPERATOR_ROLE = await gatewayContract.OPERATOR_ROLE();
      if (!isFirstExecution) {
        // オペレーターの追加
        const operators = [
          "0x64Fc03A7C9E4B8578e9B768A5a797Eb338e23d64",
          "0xcfeDd35885f31d59A22A206ED4b43f47740cEA8d",
          "0xA345b35D78fd68831C9Cbaf5484593E392F8eF4B"
        ];

        await grantOperatorsRole(gatewayContract, OPERATOR_ROLE, operators);
      }
      
      
      // claim test
      const ftContract = await attachContract<MyToken>(
        hre,
        "MyToken",
        ft,
        signer
      )
      const address = await signer.getAddress();
      await (await ftContract.mint(gateway, BigInt("1000000000000000000000000000"))).wait();

      const amount = BigInt("1")
      await gatewayContract.claim(
        address,
        amount,
        0,
        "2",
      )

    } catch (error) {
      console.error("Error setting gateway configuration:", error);
    }
  });

/**
 * コントラクトをアタッチするユーティリティ関数
 * @param hre Hardhat Runtime Environment
 * @param contractName コントラクト名
 * @param address コントラクトアドレス
 * @param signer サイナー
 */
async function attachContract<T>(
  hre: any,
  contractName: string,
  address: string,
  signer: any
): Promise<T> {
  const factory = (await hre.ethers.getContractFactory(contractName, signer)) as any;
  return factory.attach(address) as T;
}

/**
 * 指定したオペレーターにMINTER_ROLEを付与する
 * @param gatewayContract Gatewayコントラクト
 * @param role 付与するロール
 * @param operators オペレーターのアドレスリスト
 */
async function grantOperatorsRole(
  gatewayContract: HeavenlyGuitarsGateway,
  role: string,
  operators: string[]
) {
  for (const operator of operators) {
    await gatewayContract.grantRole(role, operator);
    console.log(`Granted ${role} to ${operator}`);
  }
}


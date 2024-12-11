import { task } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
import "dotenv/config";
import { HeavenlyGuitars, HeavenlyGuitars__factory } from "../typechain-types";
import { HeavenlyGuitarsGateway, HeavenlyGuitarsGateway__factory } from "../typechain-types";
import { getSigner } from "../utils/getKmsSinger";

task("set:set-gateway-kms", "Set gateway configuration.")
  .addParam("contract", "NFT Contract Name")
  .addParam("nft", "NFT Contract Address")
  .addParam("gateway", "Gateway Address")
  .addParam("networks", "Networks")
  .addParam("type", "NFT Type")
  .setAction(async (args, hre) => {
    const { contract, nft, gateway, networks, type } = args;

    try {
      // Signerの取得
      const signer = await getSigner(networks);
      const signerAddress = await signer.getAddress();
      console.log("Signer Address:", signerAddress);

      // NFTとGatewayのコントラクトファクトリのインスタンスを取得
      const nftContract = await attachContract<HeavenlyGuitars>(
        hre,
        contract,
        nft,
        signer
      );
      const gatewayContract = await attachContract<HeavenlyGuitarsGateway>(
        hre,
        "HeavenlyGuitarsGateway",
        gateway,
        signer
      );

       //await gatewayContract.exportNfts(
       // "0xC5A004276ea238FB616EfBE962b8DA06Cb7E1A47",
       // 1,
       // [BigInt("2")],
       // "1"
       // )
       //return

      const MINTER_ROLE = await nftContract.MINTER_ROLE();
      await nftContract.grantRole(MINTER_ROLE, gateway);

      await gatewayContract.setERC721Addresses([type], [nft]);

      // MINTER_ROLEの付与

      // GatewayにNFTのアドレスを設定
      const OPERATOR_ROLE = await gatewayContract.OPERATOR_ROLE();

      // 初回実行かどうかのチェック
      const isFirstExecution = false;
      if (!isFirstExecution) {
        // オペレーターの追加
        const operators = [
          "0x64Fc03A7C9E4B8578e9B768A5a797Eb338e23d64",
          "0xcfeDd35885f31d59A22A206ED4b43f47740cEA8d",
          "0xA345b35D78fd68831C9Cbaf5484593E392F8eF4B"
        ];

        await grantOperatorsRole(gatewayContract, OPERATOR_ROLE, operators);
      }
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


import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-ignition-ethers";
import "./tasks";
import "dotenv/config";
import "@nomicfoundation/hardhat-verify";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    sepolia: {
      //url: `https://1rpc.io/sepolia`,
      //url: "https://rpc.sepolia.org",
      url: "https://sepolia.infura.io/v3/94206f56b16540d5ac00c4d4e4834690",
      chainId: 11155111,
      //accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    amoy: {
      url: "https://polygon-amoy.infura.io/v3/5076537e2d3d43aaa87e275d935b68d0",
      chainId: 80002,
      timeout: 200000, // タイムアウトの増加
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    minato: {
      url: "https://rpc.minato.soneium.org/",
      chainId:1946
    },
    oasys_testnet: {
      url: "https://rpc.testnet.oasys.games",
      chainId: 9372,
    }
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY as string,
      polygonMumbai: process.env.POLYGON_API_KEY as string,
      polygon: process.env.POLYGON_API_KEY as string,
      goerli: process.env.ETHERSCAN_API_KEY as string,
      tcgverse_testnet: 'foo',
      mchverse_testnet: 'foo',
      oasys_testnet: 'foo',
      hub_mainnet: 'foo',
      dm2: 'foo',
      dm2_testnet: 'foo',
    },
    customChains: [
      {
        network: 'tcgverse_testnet',
        chainId: 12005,
        urls: {
          apiURL: 'https://testnet.explorer.tcgverse.xyz/api',
          browserURL: 'https://testnet.explorer.tcgverse.xyz',
        },
      },
      {
        network: 'mchverse_testnet',
        chainId: 420,
        urls: {
          apiURL: 'https://explorer.oasys.sand.mchdfgh.xyz/api',
          browserURL: 'https://explorer.oasys.sand.mchdfgh.xyz/',
        },
      },
      {
        network: 'oasys_testnet',
        chainId: 9372,
        urls: {
          apiURL: 'https://explorer.testnet.oasys.games/api',
          browserURL: 'https://explorer.testnet.oasys.games/',
        },
      },
      {
        network: 'hub_mainnet',
        chainId: 248,
        urls: {
          apiURL: 'https://explorer.oasys.games/api',
          browserURL: 'https://explorer.oasys.games/',
        },
      },
      {
        network: 'minato',
        chainId: 1946,
        urls: {
          apiURL: 'https://soneium-minato.blockscout.com/api',
          browserURL: 'https://explorer.minato.soneium.org/',
        },
      }
    ],
  },
  sourcify: {
    enabled: false,
    apiUrl: "https://sourcify.dev/server",
    browserUrl: "https://repo.sourcify.dev",
  },
};

export default config;

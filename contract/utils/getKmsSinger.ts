import { AwsKmsSigner } from "./kmsSigner";
import { ethers } from "ethers";

export const getSigner = async (network: string): Promise<AwsKmsSigner<ethers.Provider | null>> => {
  const keyId = process.env.AWS_KMS_KEY_ID || "";
  const region = process.env.AWS_REGION || "";

  let provider;

  if (network === "sepolia"){
    //provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
    provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/94206f56b16540d5ac00c4d4e4834690");
  } else if (network === "amoy"){
    //provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
    provider = new ethers.JsonRpcProvider("https://polygon-amoy.infura.io/v3/5076537e2d3d43aaa87e275d935b68d0");
  } else if (network === "oasys_testnet"){
    provider = new ethers.JsonRpcProvider("https://rpc.testnet.oasys.games");
  } else if (network === "minato") {
    provider = new ethers.JsonRpcProvider("https://rpc.minato.soneium.org/");
  } else {
    provider = new ethers.JsonRpcProvider("");
  }

  const signer = new AwsKmsSigner({
      keyId,
      region
  }).connect(provider);

  return signer;
};

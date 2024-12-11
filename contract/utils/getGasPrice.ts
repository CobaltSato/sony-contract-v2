export const estimateGasPrice = async (hre: { ethers: { provider: { getFeeData: () => any; }; }; }) => {
    const feeData = await hre.ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice
      ? BigInt(feeData.gasPrice.toString())
      : BigInt("20000000000"); // default to 20 gwei
    const buffer = gasPrice / BigInt(10); // Calculate a 10% buffer
    const adjustedGasPrice = gasPrice + buffer;

    return adjustedGasPrice;

}

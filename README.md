
## setup
cd contract
cp .env.sample .env
yarn install
npx hardhat compile

## deploy Erc20Mock

npx hardhat deploy:deploy-ft-kms \
  --contract "MyToken" \
  --network sepolia \
  --networks sepolia

sample ft: 0x1e92043482C591c322c679A536041f0F7Aa0E8C6

## deploy nft

npx hardhat deploy:deploy-nft-kms \
  --contract "HeavenlyGuitars" \
  --name "HeavenlyGuitars" \
  --symbol "HG" \
  --uri "https://develop.guitar-dev.pandolor.com/metadata/1/" \
  --network sepolia \
  --networks sepolia

npx hardhat deploy:deploy-nft-kms \
  --contract "HeavenlyGuitars" \
  --name "HeavenlyGuitars" \
  --symbol "HG" \
  --uri "https://develop.guitar-dev.pandolor.com/metadata/1/" \
 --network minato \
 --networks minato

npx hardhat deploy:deploy-nft-kms \
  --contract "HeavenlyGuitars" \
  --name "HeavenlyGuitars" \
  --symbol "HG" \
  --uri "https://develop.guitar-dev.pandolor.com/metadata/2/" \
  --network sepolia \
  --networks sepolia

npx hardhat deploy:deploy-nft-kms \
  --contract "HeavenlyGuitars" \
  --name "HeavenlyGuitars" \
  --symbol "HG" \
  --uri "https://develop.guitar-dev.pandolor.com/metadata/3/" \
  --network sepolia \
  --networks sepolia

npx hardhat deploy:deploy-nft-kms \
  --contract "HeavenlyGuitars" \
  --name "HeavenlyGuitars" \
  --symbol "HG" \
  --uri "https://develop.guitar-dev.pandolor.com/metadata/4/" \
  --network sepolia \
  --networks sepolia

npx hardhat deploy:deploy-nft-kms \
  --contract "HeavenlyGuitars" \
  --name "HeavenlyGuitars" \
  --symbol "HG" \
  --uri "https://develop.guitar-dev.pandolor.com/metadata/5/" \
  --network sepolia \
  --networks sepolia

nft_1: 0xC93D3A01E140D0F8408190f76CF954b4Ea194Ca8
nft_2: 0xBF193fB83574fb8d6fccfd94e8fA80025Ae86BdA
nft_3: 0x799Aba3329f9dC65Cb764e4bf137ECC898Eba5Bc
nft_4: 0x663c8A51baFd1bEA0Af9dcD556038Ed6F2D541D4
nft_0: 0x9BE92687bc861401e04C7B6D2e51e65110c5e935


npx hardhat verify --network sepolia ${nft_address}

## deploy Erc20Mock

## deploy gateway

npx hardhat deploy:deploy-gateway-kms \
  --contract "HeavenlyGuitarsGateway" \
  --network sepolia \
  --networks sepolia

gateway_address: 0xb877CcFC40C07Af00e4839bF893269DF0fbae1F3

npx hardhat verify --network sepolia 0xfF7cFa125E9798E8D55618f6baC9Cc184Eaef4E0

npx hardhat set:set-gateway-kms \
  --contract "HeavenlyGuitars" \
  --nft "0xC93D3A01E140D0F8408190f76CF954b4Ea194Ca8" \
  --gateway "0xb877CcFC40C07Af00e4839bF893269DF0fbae1F3" \
  --network sepolia \
  --networks sepolia \
  --type 1

npx hardhat set:set-gateway-kms \
  --contract "HeavenlyGuitars" \
  --nft "0xBF193fB83574fb8d6fccfd94e8fA80025Ae86BdA" \
  --gateway "0xb877CcFC40C07Af00e4839bF893269DF0fbae1F3" \
  --network sepolia \
  --networks sepolia \
  --type 2

npx hardhat set:set-gateway-kms \
  --contract "HeavenlyGuitars" \
  --nft "0x799Aba3329f9dC65Cb764e4bf137ECC898Eba5Bc" \
  --gateway "0xb877CcFC40C07Af00e4839bF893269DF0fbae1F3" \
  --network sepolia \
  --networks sepolia \
  --type 3

npx hardhat set:set-gateway-kms \
  --contract "HeavenlyGuitars" \
  --nft "0x663c8A51baFd1bEA0Af9dcD556038Ed6F2D541D4" \
  --gateway "0xb877CcFC40C07Af00e4839bF893269DF0fbae1F3" \
  --network sepolia \
  --networks sepolia \
  --type 4

npx hardhat set:set-gateway-kms \
  --contract "HeavenlyGuitars" \
  --nft "0x9BE92687bc861401e04C7B6D2e51e65110c5e935" \
  --gateway "0xb877CcFC40C07Af00e4839bF893269DF0fbae1F3" \
  --network sepolia \
  --networks sepolia \
  --type 0

## deploy ft

npx hardhat deploy:deploy-ft-kms \
  --contract "MyToken" \
  --network sepolia \
  --networks sepolia

sample ft: 0x738A021c864Ea05e8a890151816f932dAc2b713e

## deploy ft gateway

npx hardhat deploy:deploy-payment-gateway-kms \
  --contract "HeavenlyGuitarsPaymentGateway" \
  --network sepolia \
  --networks sepolia

ft gateway: 0xdF77CBdB159Afc012De4734F42069B5D162832B7

npx hardhat set:set-payment-gateway-kms \
  --ft "0x1e92043482C591c322c679A536041f0F7Aa0E8C6" \
  --gateway "0x30ebEb62a3798e4499d90CE728AaF560BC4f6AC5" \
  --network sepolia \
  --networks sepolia \
  --type 0# sony-contract-v2

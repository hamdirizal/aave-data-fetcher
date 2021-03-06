/* import moralis */
const Moralis = require("moralis/node");

const ATokenV2Artifact = require('@aave/protocol-v2/artifacts/contracts/protocol/tokenization/AToken.sol/AToken.json');
const LendingPoolV2Artifact = require('@aave/protocol-v2/artifacts/contracts/protocol/lendingpool/LendingPool.sol/LendingPool.json');
const AaveProtocolDataProviderV2Artifact = require('@aave/protocol-v2/artifacts/contracts/misc/AaveProtocolDataProvider.sol/AaveProtocolDataProvider.json');


const ATokenV3Artifact = require('@aave/core-v3/artifacts/contracts/protocol/tokenization/AToken.sol/AToken.json');
const PoolV3Artifact = require('@aave/core-v3/artifacts/contracts/protocol/pool/Pool.sol/Pool.json');
const AaveProtocolDataProviderV3Artifact = require('@aave/core-v3/artifacts/contracts/misc/AaveProtocolDataProvider.sol/AaveProtocolDataProvider.json');

const RAY = 10 ** 27 //I don't know where this number comes from. Got this from AAVE doc.
const SECONDS_PER_YEAR = 31536000


/**
 * Calculate APY from APR. Formula taken from here https://docs.aave.com/developers/v/2.0/guides/apy-and-apr
 * @param number aprValue
 * @return number 
 */
function calculateApyFromApr(aprValue) {
  return Math.pow((1 + (aprValue / SECONDS_PER_YEAR)), SECONDS_PER_YEAR) - 1;
}

/**
 * Get all V2 reserves
 * @param string chainId The v2 network. Hamdi's Moralis account only supports "eth" and "polygon"
 * @returns array
 */
async function getAllV2Reserves(chainId) {
  const options = {
    chain: chainId,
    address: '0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d',
    function_name: "getAllReservesTokens",
    abi: AaveProtocolDataProviderV2Artifact.abi,
    params: {},
  };
  const arr = await Moralis.Web3API.native.runContractFunction(options);
  if (!arr) return null;
  return arr.map(item => {
    return { symbol: item[0], address: item[1] }
  })
}


async function getV2ATokenTotalSupply(tokenAddress, chainId) {
  const options = {
    chain: chainId,
    address: tokenAddress,
    function_name: "totalSupply",
    abi: ATokenV2Artifact.abi,
    params: {},
  }
  return await Moralis.Web3API.native.runContractFunction(options);
}

/**
 * 
 * @param string assetAddress
 * @param string symbol 
 * @param string chainId The v2 network. Hamdi's Moralis account only supports "eth" and "polygon"
 * @returns object
 */
async function getV2ReserveDataOfAddress(assetAddress, symbol, chainId) {
  const options = {
    chain: chainId,
    address: "0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9",
    function_name: "getReserveData",
    abi: LendingPoolV2Artifact.abi,
    params: { asset: assetAddress },
  }

  //TODO STOP EDITING

  //A lot of unused variables, I intentionally leave it here for reference
  const [
    configuration,
    liquidityIndex,
    variableBorrowIndex,
    currentLiquidityRate,
    currentVariableBorrowRate,
    currentStableBorrowRate,
    lastUpdateTimestamp,
    aTokenAddress,
    stableDebtTokenAddress,
    variableDebtTokenAddress,
    interestRateStrategyAddress,
    id
  ] = await Moralis.Web3API.native.runContractFunction(options);

  let depositAPR = currentLiquidityRate / RAY;
  let variableBorrowAPR = currentVariableBorrowRate / RAY;
  let stableBorrowAPR = currentStableBorrowRate / RAY;
  let depositAPY = calculateApyFromApr(depositAPR);
  let variableBorrowAPY = calculateApyFromApr(variableBorrowAPR);
  let stableBorrowAPY = calculateApyFromApr(stableBorrowAPR);


  return {
    id,
    symbol,
    aTokenAddress,
    depositAPY: depositAPY * 100, //Multiplied by 100 to get percentage value
    variableBorrowAPY: variableBorrowAPY * 100, //Multiplied by 100 to get percentage value
    stableBorrowAPY: stableBorrowAPY * 100, //Multiplied by 100 to get percentage value
  }
}


/**
 * Get all V3 reserves
 * @param string chainId The v3 network. Hamdi's Moralis account only supports "fantom" and "polygon"
 * @returns array
 */
async function getAllV3Reserves(chainId) {
  const options = {
    chain: chainId,
    address: '0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654',
    function_name: "getAllReservesTokens",
    abi: AaveProtocolDataProviderV3Artifact.abi,
    params: {},
  };
  const arr = await Moralis.Web3API.native.runContractFunction(options);
  if (!arr) return null;
  return arr.map(item => {
    return { symbol: item[0], address: item[1] }
  })
}

async function getV3ATokenTotalSupply(tokenAddress, chainId) {
  const options = {
    chain: chainId,
    address: tokenAddress,
    function_name: "totalSupply",
    abi: ATokenV3Artifact.abi,
    params: {},
  }
  return await Moralis.Web3API.native.runContractFunction(options);
}

/**
 * 
 * @param string assetAddress
 * @param string symbol 
 * @param string chainId The v3 network. Hamdi's Moralis account only supports "fantom" and "polygon"
 * @returns object
 */
async function getV3ReserveDataOfAddress(assetAddress, symbol, chainId) {
  const options = {
    chain: chainId,
    address: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    function_name: "getReserveData",
    abi: PoolV3Artifact.abi,
    params: { asset: assetAddress },
  }

  //A lot of unused variables, I intentionally leave it here for reference
  const [
    configuration,
    liquidityIndex,
    currentLiquidityRate,
    variableBorrowIndex,
    currentVariableBorrowRate,
    currentStableBorrowRate,
    lastUpdateTimestamp,
    id,
    aTokenAddress,
    stableDebtTokenAddress,
    variableDebtTokenAddress,
    interestRateStrategyAddress,
    accruedToTreasury,
    unbacked,
    isolationModeTotalDebt] = await Moralis.Web3API.native.runContractFunction(options);

  let depositAPR = currentLiquidityRate / RAY;
  let variableBorrowAPR = currentVariableBorrowRate / RAY;
  let stableBorrowAPR = currentStableBorrowRate / RAY;
  let depositAPY = calculateApyFromApr(depositAPR);
  let variableBorrowAPY = calculateApyFromApr(variableBorrowAPR);
  let stableBorrowAPY = calculateApyFromApr(stableBorrowAPR);

  return {
    id,
    symbol,
    aTokenAddress,
    depositAPY: depositAPY * 100, //Multiplied by 100 to get percentage value
    variableBorrowAPY: variableBorrowAPY * 100, //Multiplied by 100 to get percentage value
    stableBorrowAPY: stableBorrowAPY * 100, //Multiplied by 100 to get percentage value
  }
}

async function getAllV2Data(chainId) {
  const v2Reserves = await getAllV2Reserves(chainId);
  v2Reserves.length = 2; //For demo, take only two items. Remove this line to get all of the assets. But it will take time to load.
  let arr = [];
  await Promise.all(v2Reserves.map(async (obj) => {
    const info = await (getV2ReserveDataOfAddress(obj.address, obj.symbol, chainId))

    //Injecting the total supply
    if (info && info.aTokenAddress) {
      info.totalSupply = await (getV2ATokenTotalSupply(info.aTokenAddress, chainId))
    }

    arr.push(info)
  }));
  return arr;
}


async function getAllV3Data() {
  const chainId = 'polygon';
  const v3Reserves = await getAllV3Reserves(chainId);
  v3Reserves.length = 2; //For demo, take only two items. Remove this line to load all. But it will take time to load.
  let arr = [];
  await Promise.all(v3Reserves.map(async (obj) => {
    const info = await (getV3ReserveDataOfAddress(obj.address, obj.symbol, chainId))

    //Injecting the total supply
    if (info && info.aTokenAddress) {
      info.totalSupply = await (getV3ATokenTotalSupply(info.aTokenAddress, chainId))
    }

    arr.push(info)
  }));
  return arr;
}


module.exports = { calculateApyFromApr, getAllV2Reserves, getV2ATokenTotalSupply, getV2ReserveDataOfAddress, getAllV3Reserves, getV3ATokenTotalSupply, getV3ReserveDataOfAddress, getAllV2Data, getAllV3Data }
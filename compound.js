/* import moralis */
const Moralis = require("moralis/node");

const { startMoralis } = require("./moralis-connector");

const CompoundConfig = require('./compound-mainnet.json')
const CompoundAbi = require('./compound-mainnet-abi.json')

const ethMantissa = 1e18;
const blocksPerDay = 6570; // 13.15 seconds per block
const daysPerYear = 365;

const assets = [
  'cETH',
  'cUSDC',
  // 'cWBTC',
  // 'cDAI',
  // 'cUSDT',
  // 'cTUSD',
  // 'cBAT',
  // 'cCOMP',
  // 'ZRX',
  // 'Uniswap',
  // 'cLINK',
  // 'cMKR',
  // 'cSUSHI',
  // 'cUSDP',
  // 'cFEI',
  // 'cSAI',
  // 'cAAVE',
  // 'cYFI',
]


function calculateSupplyApy(supplyRatePerBlock) {
  //The formula is coming from this doc https://compound.finance/docs#protocol-math
  return (((Math.pow((supplyRatePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear))) - 1) * 100;
}

function calculateBorrowApy(borrowRatePerBlock) {
  //The formula is coming from this doc https://compound.finance/docs#protocol-math
  return (((Math.pow((borrowRatePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear))) - 1) * 100;
}



async function getDilutedMarketCap(chain, contractAddress, abi) {
  /*
  The formula

  From the documentation https://compound.finance/docs/ctokens#exchange-rate , we have the exchangeRate formula.
  (f1) exchangeRate = (cash + totalBorrows - totalReserves) / totalSupply

  and from the Etherscan we have this information: 
  (f2) dilutedMarketCap = exchangeRate * totalSupply

  Then, feed the (f1) into (f2), we get
  (f3) dilutedMarketCap = cash + totalBorrows - totalReserves;
  */
  const cash = await Moralis.Web3API.native.runContractFunction({
    chain: chain,
    address: contractAddress,
    function_name: "getCash",
    abi: abi,
    params: {},
  });
  const totalBorrows = await Moralis.Web3API.native.runContractFunction({
    chain: chain,
    address: contractAddress,
    function_name: "totalBorrows",
    abi: abi,
    params: {},
  });
  const totalReserves = await Moralis.Web3API.native.runContractFunction({
    chain: chain,
    address: contractAddress,
    function_name: "totalReserves",
    abi: abi,
    params: {},
  });
  return parseInt(cash) + parseInt(totalBorrows) - parseInt(totalReserves)

}

/**
 * 
 */
async function getSupplyRatePerBlock(chain, contractAddress, abi) {
  return await Moralis.Web3API.native.runContractFunction({
    chain: chain,
    address: contractAddress,
    function_name: "supplyRatePerBlock",
    abi: abi,
    params: {},
  });
}

async function getBorrowRatePerBlock(chain, contractAddress, abi) {
  return await Moralis.Web3API.native.runContractFunction({
    chain: chain,
    address: contractAddress,
    function_name: "borrowRatePerBlock",
    abi: abi,
    params: {},
  });
}

async function getAllData() {
  let resultsArr = [];
  await Promise.all(assets.map(async (assetKey) => {
    let obj = {}
    const supplyRate = await getSupplyRatePerBlock('eth', CompoundConfig.Contracts[assetKey], CompoundAbi[assetKey])
    const borrowRate = await getBorrowRatePerBlock('eth', CompoundConfig.Contracts[assetKey], CompoundAbi[assetKey])
    const supplyApy = calculateSupplyApy(supplyRate)
    const borrowApy = calculateBorrowApy(borrowRate)
    // const totalSupply = await getDilutedMarketCap('eth', CompoundConfig.Contracts[assetKey], CompoundAbi[assetKey])
    obj.symbol = assetKey
    obj.supplyApyPercent = supplyApy
    obj.borrowApyPercent = borrowApy
    obj.totalSupply = null
    resultsArr.push(obj);
  }));
  return resultsArr;
}

async function run() {

  await startMoralis();
  const resultsArr = await getAllData();
  console.log(resultsArr)



  // const supplyRatePerBlock = await getSupplyRatePerBlock('eth', CompoundConfig.Contracts[assets[0]], CompoundAbi[assets[0]])
  // console.log(supplyRatePerBlock);
  // const supplyApy = calculateSupplyApy(supplyRatePerBlock);
  // console.log(supplyApy);

  // const dilutedMarketCap = await getDilutedMarketCap('eth', CompoundConfig.Contracts[assets[6]], CompoundAbi[assets[6]])
  // console.log('dilutedMarketCap', dilutedMarketCap)

}

run();

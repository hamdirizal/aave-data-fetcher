/* import moralis */
const Moralis = require("moralis/node");

const { startMoralis } = require("./moralis-connector");

const CompoundConfig = require('./compound-mainnet.json')
const CompoundAbi = require('./compound-mainnet-abi.json')

// const RAY = 10 ** 27 //I don't know where this number comes from. Got this from AAVE doc.
// const SECONDS_PER_YEAR = 31536000

async function run() {

  await startMoralis();

  const ethMantissa = 1e18;
  const blocksPerDay = 6570; // 13.15 seconds per block
  const daysPerYear = 365;

  // const supplyRatePerBlock = await cToken.methods.supplyRatePerBlock().call();
  // const borrowRatePerBlock = await cToken.methods.borrowRatePerBlock().call();
  // const supplyApy = (((Math.pow((supplyRatePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear))) - 1) * 100;
  // const borrowApy = (((Math.pow((borrowRatePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear))) - 1) * 100;
  // console.log(`Supply APY for ETH ${supplyApy} %`);
  // console.log(`Borrow APY for ETH ${borrowApy} %`);




  const supplyRatePerBlock = await Moralis.Web3API.native.runContractFunction({
    chain: 'eth',
    address: CompoundConfig.Contracts.cDAI,
    function_name: "supplyRatePerBlock",
    abi: CompoundAbi.cDAI,
    params: {},
  });

  const supplyApy = (((Math.pow((supplyRatePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear))) - 1) * 100;
  console.log('supplyRatePerBlock', supplyRatePerBlock)
  console.log('supplyApy', supplyApy.toFixed(2), '%')

  // const options2 = {
  //   chain: 'eth',
  //   address: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
  //   function_name: "borrowRatePerBlock",
  //   abi: JSON.parse(cDAI_abi),
  //   params: {},
  // };
  // const borrowRatePerBlock = await Moralis.Web3API.native.runContractFunction(options2);



  // const borrowApy = (((Math.pow((borrowRatePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear))) - 1) * 100;
  // console.log('borrowRatePerBlock', borrowRatePerBlock)
  // console.log('borrowApy', borrowApy.toFixed(2), '%')
}

run();

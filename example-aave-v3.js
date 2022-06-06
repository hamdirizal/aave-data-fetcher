const { getAllV3Reserves, getV3ReserveDataOfAddress, getV3ATokenTotalSupply } = require("./aave");
const { startMoralis } = require("./moralis-connector");

async function run() {
  await startMoralis();

  console.log('V3 EXAMPLE: POLYGON')
  const chainId = 'polygon';
  const v3Reserves = await getAllV3Reserves(chainId);
  v3Reserves.length = 2; //For demo, take only two items. Remove this line to load all. But it will take time to load.
  await Promise.all(v3Reserves.map(async (obj) => {
    const info = await (getV3ReserveDataOfAddress(obj.address, obj.symbol, chainId))

    //Injecting the total supply
    if (info && info.aTokenAddress) {
      info.totalSupply = await (getV3ATokenTotalSupply(info.aTokenAddress, chainId))
    }

    console.log(info)
  }));

}

run();
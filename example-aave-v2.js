const { startMoralis, getAllV2Reserves, getV2ReserveDataOfAddress, getV2ATokenTotalSupply } = require("./aave");

async function run() {
  await startMoralis();
  console.log('V2 EXAMPLE: ETHEREUM')
  const chainId = 'eth';
  const v2Reserves = await getAllV2Reserves(chainId);
  v2Reserves.length = 2; //For demo, take only two items. Remove this line to load all. But it will take time to load.
  await Promise.all(v2Reserves.map(async (obj) => {
    const info = await (getV2ReserveDataOfAddress(obj.address, obj.symbol, chainId))

    //Injecting the total supply
    if (info && info.aTokenAddress) {
      info.totalSupply = await (getV2ATokenTotalSupply(info.aTokenAddress, chainId))
    }

    console.log(info)
  }));
}

run();
const { getAllV3Data, getAllV3Reserves, getV3ReserveDataOfAddress, getV3ATokenTotalSupply } = require("./aave/main");
const { startMoralis } = require("./moralis-connector");

async function run() {
  await startMoralis();

  console.log('V3 EXAMPLE: POLYGON')
  const aaveV3Data = await getAllV3Data("polygon")
  console.log(aaveV3Data)


}

run();
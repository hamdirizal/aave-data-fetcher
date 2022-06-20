const { getAllV2Reserves, getV2ReserveDataOfAddress, getV2ATokenTotalSupply, getAllV2Data } = require("./aave/main");
const { startMoralis } = require("./moralis-connector");

async function run() {
  await startMoralis();
  console.log('V2 EXAMPLE: ETHEREUM')
  let aaveV2data = await getAllV2Data("eth");
  console.log(aaveV2data)
}

run();
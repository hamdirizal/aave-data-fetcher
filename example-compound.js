const { startMoralis } = require("./moralis-connector");
const { getAllData } = require("./compound/main");

async function run() {
  await startMoralis()
  const resultsArr = await getAllData();
  console.log(resultsArr)

}

run();
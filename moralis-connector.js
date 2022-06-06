/* import moralis */
const Moralis = require("moralis/node");

/* Hamdi's Moralis free API key */
const serverUrl = "https://xd3mlg32ftmi.usemoralis.com:2053/server";
const appId = "Y0wHemuqcWaeMjuXggzi5yidwzltcZE9Aehh3YWF";
const masterKey = "nrc5vEYuIMNzUPIJNM7pIdHp5IkFnFxLkpzKw4HR";

async function startMoralis() {
  await Moralis.start({ serverUrl, appId, masterKey });
}

module.exports = { startMoralis }
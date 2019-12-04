/*
 * $ node index.js -o "./oas-files/Meraki Dashboard API-Swagger20-v0.json" -n "./oas-files/Meraki Dashboard API-Swagger20-v0.1.json"
 */

const program = require("commander");
const genLogs = require("./app/genLogs");

program
  .option("-o, --oldSpec <oldSpec>", "The Meraki API Key")
  .option("-n, --newSpec <newSpec>", "The organization ID")
  .parse(process.argv);
if (!program.oldSpec || !program.newSpec) {
  console.log("missing required inputs");
  return;
}

/******* */

const oldSpec = program.oldSpec || "";
const newSpec = program.newSpec || "";

genLogs(oldSpec, newSpec);

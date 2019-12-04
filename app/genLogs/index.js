const writeHtml = require("./writeFiles/html");
const writeJsonFile = require("./writeFiles/json");
const writeMarkdownFile = require("./writeFiles/markdown");
const SwaggerParser = require("swagger-parser");

const changelog = require("../../swagger-changelog-merakified").changelog;
const mergeSpecWithChanges = require("./mergeSpec");

const config = {
  changes: {
    breaks: 1,
    smooths: 1
  },
  thresholds: {
    param: 0.8,
    endpoint: 0.5
  }
};

module.exports = async function genLogs(
  oldSpecPath,
  newSpecPath,
  location = "./output"
) {
  const oldSpec = await SwaggerParser.parse(oldSpecPath);
  console.log("oldSpec", oldSpec.info.version);
  const newSpec = await SwaggerParser.parse(newSpecPath);
  console.log("newSpec", newSpec.info.version);

  context = {};

  context.oldVersion = oldSpec.info.version; //.info.version; //.info.version;
  context.newVersion = newSpec.info.version;
  console.log("oldVersion", context.oldVersion);
  console.log("newVersion", context.newVersion);

  const log = await changelog(oldSpec, newSpec, config);
  const res = await mergeSpecWithChanges(log.diff, newSpec);
  const diff = res;

  context.uniqueNames = [...new Set(diff.map(item => item.name))];
  // move Renamed to top
  /*
 context.uniqueNames = [
   "Renamed",
   ...context.uniqueNames.filter(item => item !== "Renamed")
 ];
 */
  context.uniqueGroups = [...new Set(diff.map(item => item.group))];

  context.uniqueMethods = [...new Set(diff.map(item => item.method))];
  context.diff = diff;

  writeJsonFile(context, location);
  const html = writeHtml(context, location);
  const markdown = writeMarkdownFile(context, location);

  context.html = html;
  context.markdown = markdown;
  return context;
};

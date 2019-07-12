/*
 * $ node index.js -o "./oas-files/Meraki Dashboard API-Swagger20-v0.json" -n "./oas-files/Meraki Dashboard API-Swagger20-v0.1.json"
 */

const program = require("commander");

program
  .option("-o, --oldSpec <oldSpec>", "The Meraki API Key")
  .option("-n, --newSpec <newSpec>", "The organization ID")
  .parse(process.argv);
if (!program.oldSpec || !program.newSpec) {
  console.log("missing required inputs");
  return;
}

/******* */

const changelog = require("./swagger-changelog-merakified").changelog;
const fs = require("fs");

const SwaggerParser = require("swagger-parser");
const hbs = require("handlebars");

const oldSpec = program.oldSpec || "";
const newSpec = program.newSpec || "";

const templateFile = fs.readFileSync("template.hbs", "utf8");
const oldSpecFile = JSON.parse(fs.readFileSync(oldSpec, "utf8"));
const newSpecFile = JSON.parse(fs.readFileSync(newSpec, "utf8"));

var config = {
  changes: {
    breaks: {
      major: 2,
      minor: 3,
      patch: 3,
      unchanged: 0
    },
    smooths: {
      major: 0,
      minor: 1,
      patch: 2,
      unchanged: 0
    }
  }
};

changelog(oldSpec, newSpec, config).then(log => {
  //console.log("log", log);
  //console.log("log.items", log.items);

  mergeSpecWithChanges(log.diff, newSpec).then(res => {
    //console.log("log.diff", JSON.stringify(log.diff));
    //console.log("res", res);
    writeJsonFile(res);

    writeWeb(res);
  });
  writeMarkdownFile(log.paragraph);
});

function writeMarkdownFile(data) {
  //console.log(log.paragraph);
  fs.writeFileSync("./output/changelog.md", data, "utf-8");
}

function writeJsonFile(data) {
  fs.writeFileSync(
    "./output/changelog.json",
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

function writeWeb(data) {
  hbs.registerHelper("ifEquals", function(arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });

  hbs.registerHelper("toUpperCase", function(str) {
    if (!str) {
      return;
    }
    return str.toUpperCase();
  });
  var template = hbs.compile(templateFile);
  webData = {};
  webData.newSpec = newSpecFile;
  webData.oldSpec = oldSpecFile;
  webData.diff = data;

  var webPage = template(webData);
  //console.log("old version:", webData.oldSpec.info.version);
  fs.writeFileSync("./output/changelog.html", webPage, "utf-8");
}

async function mergeSpecWithChanges(diff, specPath) {
  //const spec = await fs.readFileSync(specPath, "utf8");

  const parsed = await SwaggerParser.parse(specPath)
    .then(r => {
      //console.log("r", r);
      return r;
    })
    .catch(e => console.log("SwaggerParser error ", e));
  // const paths = parsed.paths;

  //console.log("parsed", parsed);
  const paths = parsed.paths;
  //console.log("paths", paths);

  diff = diff.map(d => {
    pathDetails = paths[d.path];
    //console.log("pathDetails", pathDetails);
    if (pathDetails) {
      if (d.method) {
        if (Object.keys(pathDetails).includes(d.method)) {
          d.apiDetails = pathDetails[d.method];
        }
      } else {
        d.apiDetails = pathDetails;
      }

      return d;
    } else {
      return d;
    }
  });

  //console.log("diff", diff);
  return diff;
}

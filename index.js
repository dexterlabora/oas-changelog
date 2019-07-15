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
var pug = require('pug');

const oldSpec = program.oldSpec || "";
const newSpec = program.newSpec || "";

const templateFile = fs.readFileSync("template.hbs", "utf8");
const oldSpecFile = JSON.parse(fs.readFileSync(oldSpec, "utf8"));
const newSpecFile = JSON.parse(fs.readFileSync(newSpec, "utf8"));

var config = {
  changes: {
    breaks: {
      major: 2,
      minor: 2,
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

  writeMarkdownFile(log.paragraph);

  mergeSpecWithChanges(log.diff, newSpec).then(res => {
    //console.log("log.diff", JSON.stringify(log.diff));
    //console.log("res", res);

    // Add extra context data
    const diff = res;
    context = {};
    context.newSpec = newSpecFile;
    context.oldSpec = oldSpecFile;
    context.uniqueNames = [...new Set(diff.map(item => item.name))];
    context.uniqueGroups = [...new Set(diff.map(item => item.group))];
    
    context.uniqueMethods = [...new Set(diff.map(item => item.method))];
    context.diff = diff;

    writeJsonFile(context);
    //writeHbsWeb(context);
    writePugWeb(context);
  });
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

function writePugWeb(data){
  
  // renderFile
  var html = pug.renderFile('index.pug', data);
  fs.writeFileSync("./output/web/changelog.html", html, "utf-8");
}

function writeHbsWeb(data) {
  hbs.registerHelper("ifEquals", function(arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });

  hbs.registerHelper("ifNotEqual", function(arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });

  hbs.registerHelper("toUpperCase", function(str) {
    if (!str) {
      return;
    }
    return str.toUpperCase();
  });
  var template = hbs.compile(templateFile);

  var webPage = template(data);
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
    if (!pathDetails) {
      return d;
    }
    pathDetailKeys = Object.keys(pathDetails);

    let firstPath = pathDetails[pathDetailKeys[0]];
    if (firstPath) {
      //console.log("Object.keys(pathDetails)", Object.keys(pathDetails));

      if (firstPath.tags) {
        console.log("pathDetails.tags", firstPath.tags);
        if (firstPath.tags.length > 0) {
          d.group = firstPath.tags[0];
        }
      } else {
        d.group = "Other Changes";
      }

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

  return diff;
}

var SwaggerDiff = require("swagger-diff");
const fs = require("fs");
//var util = require("util");

const oldSpec = "./oas-files/Meraki Dashboard API-Swagger20-v0.json";
const newSpec = "./oas-files/Meraki Dashboard API-Swagger20-v0.1.json";

const config = {
  changes: {
    breaks: {
      major: 2,
      minor: 3,
      patch: 3,
      unchanged: 3
    },
    smooths: {
      major: 0,
      minor: 1,
      patch: 2,
      unchanged: 3
    }
  }
};

SwaggerDiff(oldSpec, newSpec, config).then(function(diff) {
  console.log(diff);
  fs.writeFileSync(
    "./output/changelogDiff.json",
    JSON.stringify(diff, null, 2),
    "utf-8"
  );
  // Handle result
});

const changelog = require("./swagger-changelog-merakified").changelog;
const fs = require("fs");

const oldSpec = "./oas-files/Meraki Dashboard API-Swagger20-v0.json";
const newSpec = "./oas-files/Meraki Dashboard API-Swagger20-v0.1.json";

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

  //console.log("log.diff", JSON.stringify(log.diff));
  fs.writeFileSync(
    "./output/changelog.json",
    JSON.stringify(log.diff, null, 2),
    "utf-8"
  );

  console.log(log.paragraph);
  fs.writeFileSync("./output/changelog.md", log.paragraph, "utf-8");
});

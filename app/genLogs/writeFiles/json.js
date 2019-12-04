const { join } = require("path");
const fs = require("fs");

module.exports = function writeJsonFile(data, location = "./output") {
    fs.writeFileSync(
        join(location, "changelog.json"),
        JSON.stringify(data, null, 2),
        "utf-8"
    );
};

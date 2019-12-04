const { join } = require("path");

const fs = require("fs");
const pug = require("pug");

module.exports = function writeHtml(data, location = "./output") {
    // renderFile
    var html = pug.renderFile(join(__dirname, "index.pug"), data);
    fs.writeFileSync(join(location, "/web/changelog.html"), html, "utf-8");
    return html;
};

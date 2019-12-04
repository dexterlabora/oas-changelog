const { join } = require("path");
const fs = require("fs");
const pug = require("pug");

const TurndownService = require("turndown");
const turndownService = new TurndownService();

module.exports = function writeMarkdownFile(data, location = "./output") {
  //console.log(log.paragraph);
  // convert webpage to markdown version
  var html = pug.renderFile(join(__dirname, "index.pug"), data);
  turndownService.remove(["style"]);
  var markdown = turndownService.turndown(html);

  fs.writeFileSync(join(location, "changelog.md"), markdown, "utf-8");
  return markdown;
};

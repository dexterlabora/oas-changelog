"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addRequiredObjectProperty;
function addRequiredObjectProperty(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match =
    kind === "N" &&
    path.length >= 3 &&
    path[path.length - 2] === "properties" &&
    rhs.required === true;
  if (match) {
    var objectPath = path.slice(0, -2).join("/");
    var propertyName = path[path.length - 1];
    var pathId = path[1];
    return {
      message: `\`${objectPath}\` - Required property \`${propertyName}\` Added`,
      messageHtml: `<strong>Required property</strong> <span><code>${propertyName}</code> Added</span>`,
      objectPath: objectPath,
      path: pathId,
      method: path[2],
      property: propertyName
    };
  }
  return false;
}
module.exports = exports["default"];

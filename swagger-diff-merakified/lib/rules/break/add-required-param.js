"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addRequiredParam;
function addRequiredParam(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match =
    kind === "N" &&
    path.length === 5 &&
    path[0] === "paths" &&
    path[3] === "parameters" &&
    rhs.required === true;
  if (match) {
    var pathId = path[1];
    var method = path[2];
    var paramName = path[4];
    return {
      message: `\`${pathId}\` \`${method}\` - Required param \`${paramName}\` Added`,
      messageHtml: `<strong>Required param</strong> <span><code>${paramName}</code> Added</span>`,
      path: pathId,
      method: method,
      method: path[2],
      param: paramName
    };
  }
  return false;
}
module.exports = exports["default"];

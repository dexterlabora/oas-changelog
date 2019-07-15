"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = editHost;
function editHost(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;
   var pathId = path[1];
  var match = kind === "E" && path.length === 1 && path[0] === "host";
  if (match) {
    return {
      message: `Host turned from \`${lhs}\` to \`${rhs}\``,
      messageHtml: `Host turned from <code>${lhs}</code> to <code>${rhs}</code>`,
      previousHost: lhs,
      currentHost: rhs,
      method: path[2],
      path: pathId
    };
  }
  return false;
}
module.exports = exports["default"];

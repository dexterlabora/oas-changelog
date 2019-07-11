"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = editBasePath;
function editBasePath(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === "E" && path.length === 1 && path[0] === "basePath";
  if (match) {
    return {
      message: `Base path turned from  \`${lhs}\` to \`${rhs}\``,
      previousBasePath: lhs,
      currentBasePath: rhs
    };
  }
  return false;
}
module.exports = exports["default"];
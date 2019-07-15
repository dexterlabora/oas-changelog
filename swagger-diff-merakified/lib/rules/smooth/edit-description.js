"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = editDescription;
function editDescription(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match =
    kind === "E" && path.length >= 2 && path[path.length - 1] === "description";
  if (match) {
    var p = "/" + path.slice(0, -1).join("/") + "/";
    var pathId = path[1];
    var method = path[2];
    return {
      message: `\`${p}\` - Description turned from \`${lhs}\` to \`${rhs}\``,
      messageHtml: `Description turned from <code>${lhs}</code> to <code>${rhs}</code>`,
      descriptionPath: p,
      path: pathId,
      method: method,
      previousDescription: lhs,
      currentDescription: rhs
    };
  }
  return false;
}
module.exports = exports["default"];

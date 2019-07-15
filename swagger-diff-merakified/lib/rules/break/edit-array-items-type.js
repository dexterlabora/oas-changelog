"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = editArrayItemsType;
function editArrayItemsType(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match =
    kind === "E" &&
    path.length >= 2 &&
    path[path.length - 2] === "items" &&
    path[path.length - 1] === "type";
  if (match) {
    var arrayPath = path.slice(0, -2).join("/");
    var pathId = path[1];
    return {
      message:
        arrayPath + " - Array items type turn from " + lhs + " to " + rhs,
      messageHtml: `<code>${arrayPath}</code> - Array items type turn from <code>${lhs}</code> to <code>$s{rhs}</code>`,
      arrayPath: arrayPath,
      path: pathId,
      method: path[2],
      previousType: lhs,
      currentType: rhs
    };
  }
  return false;
}
module.exports = exports["default"];

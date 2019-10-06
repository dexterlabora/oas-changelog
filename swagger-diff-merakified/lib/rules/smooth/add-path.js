"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addPath;
function addPath(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;
  if (!rhs) {
    return;
  }
  var methods = Object.keys(rhs);

  function htmlEntities(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var match = kind === "N" && path.length === 2 && path[0] === "paths";
  if (match) {
    var pathId = path[1];
    var html = "Path added";
    methods.forEach(m => {
      var endpoint = rhs[m];
      var responseKeys = Object.keys(endpoint.responses);
      var responses = [];

      responseKeys.forEach(r => {
        delete endpoint.responses[r].schema;
        responses.push(endpoint.responses[r]);
      });
      var example = responses[0].examples; // hard code first response.. maybe to opinionated
      var exampleString = "";
      if (example) {
        var exampleKeys = Object.keys(example);
        example = example[exampleKeys[0]];
        exampleString = JSON.stringify(example, null, 4);
      }

      // clear out HTML in example
      //example = escape(example);
      html += `
      <br>
      <div class="mr-4 badge ${m}">${m.toUpperCase()}</div> 
      <i>${endpoint.operationId}</i>
      <br>
      <b>${endpoint.description}</b>
      
      <pre><code>${htmlEntities(exampleString)}</code></pre>
      `;
    });

    return {
      message: `\`${pathId}\` - Added`,
      // messageHtml: `Path Added
      // <b>parameters</b>
      // <pre><code>${JSON.stringify(rhs, null, 4)}</code></pre>`,
      messageHtml: html,
      method: path[2],
      path: pathId
    };
  }
  return false;
}
module.exports = exports["default"];

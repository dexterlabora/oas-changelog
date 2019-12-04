"use strict";

const SwaggerDiff = require("../../../swagger-diff-merakified");
const Levenshtein = require("damerau-levenshtein");

const TYPE_MAP = {
  errors: {
    name: "Updates"
  },
  renamed: {
    name: "Renamed"
  },
  warnings: {
    name: "Major"
  },
  infos: {
    name: "Changes"
  },
  unmatched: {
    name: "Unmatched"
  },
  unmatchDiffs: {
    name: "UnmatchDiffs"
  }
};

/**
 * Provide a diff between two spec files
 * @param  {Object} oldSpec a valid swagger spec
 * @param  {Object} newSpec a valid swagger spec
 * @return {Promise}        resolves with an array of items
 * [
 *    {
 *      ruleId: 'delete-path',
 *      message: '/pet/findByStatus - Deleted',
 *      path: '/pet/findByStatus',
 *      type: 'error'
 *    }
 * ]
 */
function diff(oldSpec, newSpec, config) {
  return SwaggerDiff(oldSpec, newSpec, config).then(
    diff =>
      new Promise(resolve => {
        const retVal = [];
        for (let type in diff) {
          for (let item of diff[type]) {
            item.type = type;
            retVal.push(item);
          }
        }

        resolve(retVal);
      })
  );
}

/**
 * Detect a rename by comparing deleted paths/arguments with new paths/arguments
 * @example deleted: /foo/bar, added: /foo/bat should result in a renamed: /foo/bar -> /foo/bar
 *
 * @param  {Object} diff   a diff object from diff()
 * @param  {Object} config settings for detection:
 * {
 *  thresholds: { // settings for thresholds
 *    endpoint: float, set the ratio threshold that counts as a match, 0-1.0 (higher means closer)
 *    param: float, set the ratio threshold that counts as a match, 0-1.0 (higher means closer)
 *  }
 * }
 * @return {Object}        Any renamed items are removed from object and added to new location
 */
function detectRenames(diff, config) {
  let retVal = diff;
  const changes = {
    endpoints: {
      deleted: [],
      deletedObj: [],
      added: [],
      addedObj: []
    },
    args: {
      deleted: [],
      added: []
    }
  };

  config = config || {};
  const thresholds = config.thresholds || {};

  const THRESHOLD_ENDPOINT =
    process.env.SC_THRES_ENDPOINT || thresholds.endpoint;
  const THRESHOLD_PARAM = process.env.SC_THRES_PARAM || thresholds.param;

  // split out endpoints and params
  for (let change of diff) {
    switch (change.ruleId) {
      case "delete-path":
        changes.endpoints.deleted.push(`\`${change.path}\``);
        changes.endpoints.deletedObj.push(change);
        break;
      case "add-path":
        changes.endpoints.added.push(change.path);
        changes.endpoints.addedObj.push(change);
        break;
      case "add-required-param":
      case "add-param":
      case "add-optional-param":
        changes.args.added.push({
          param: change.param,
          path: change.path,
          method: change.method
        });
        break;
      case "delete-param":
        changes.args.deleted.push({
          param: change.param,
          path: change.path,
          method: change.method
        });
        break;
    }
  }

  // compare and look for similar items
  for (let endpoint of changes.endpoints.deletedObj) {
    const closest = changes.endpoints.addedObj.reduce(
      (best, addedEndpoint) => {
        // console.log("endpoint ", endpoint);
        const endpointKeys = Object.keys(endpoint.details);
        // console.log("endpoint.details", endpoint.details);

        // console.log("addedEndpoint", addedEndpoint);
        // console.log("addedEndpoint.details", addedEndpoint.details);

        const ldiff = new Levenshtein(
          JSON.stringify(endpoint.details),
          JSON.stringify(addedEndpoint.details)
        );
        if (ldiff.similarity > best.similarity) {
          best.endpoint = addedEndpoint;
          best.similarity = ldiff.similarity;
        }

        return best;
      },
      { endpoint: "", similarity: 0 }
    );

    if (closest.similarity >= (parseFloat(THRESHOLD_ENDPOINT) || 0.85)) {
      // we have  a match
      // strip out the add/deleted
      retVal = retVal.filter(item => {
        return !(
          (item.path === endpoint.path ||
            item.path === closest.endpoint.path) &&
          (item.ruleId === "delete-path" || item.ruleId === "add-path")
        );
      });

      // add the rename
      retVal.push({
        ruleId: "rename-path",
        message: `Path \`${endpoint.path}\` renamed to \`${closest.endpoint.path}\``,
        messageHtml: `Path <code>${endpoint.path}</code> renamed to <code>${closest.endpoint.path}</code>`,
        path: endpoint.path,
        newPath: closest.endpoint.path,
        type: "renamed"
      });
    }
  }

  // // compare and look for similar items
  // for (let endpoint of changes.endpoints.deleted) {
  //   const closest = changes.endpoints.added.reduce(
  //     (best, addedEndpoint) => {
  //       const ldiff = new Levenshtein(endpoint, addedEndpoint);
  //       if (ldiff.similarity > best.similarity) {
  //         best.endpoint = addedEndpoint;
  //         best.similarity = ldiff.similarity;
  //       }

  //       return best;
  //     },
  //     { endpoint: "", similarity: 0 }
  //   );

  //   if (closest.similarity >= (parseFloat(THRESHOLD_ENDPOINT) || 0.85)) {
  //     // we have  a match
  //     // strip out the add/deleted
  //     retVal = retVal.filter(item => {
  //       return !(
  //         (item.path === endpoint || item.path === closest.endpoint) &&
  //         (item.ruleId === "delete-path" || item.ruleId === "add-path")
  //       );
  //     });

  //     // add the rename
  //     retVal.push({
  //       ruleId: "rename-path",
  //       message: `Path \`${endpoint}\` renamed to \`${closest.endpoint}\``,
  //       messageHtml: `Path <code>${endpoint}</code> renamed to <code>${closest.endpoint}</code>`,
  //       path: endpoint,
  //       newPath: closest.endpoint,
  //       type: "renamed"
  //     });
  //   }
  // }

  for (let param of changes.args.deleted) {
    const closest = changes.args.added.reduce(
      (best, addedParam) => {
        const ldiff = new Levenshtein(param.param, addedParam.param);
        if (ldiff.similarity > best.similarity) {
          best.param = addedParam;
          best.similarity = ldiff.similarity;
        }

        return best;
      },
      { param: {}, similarity: 0 }
    );

    if (closest.similarity >= (parseFloat(THRESHOLD_PARAM) || 0.75)) {
      // we have  a match
      // strip out the add/deleted
      retVal = retVal.filter(item => {
        return !(
          (item.path === param.path || item.path === closest.param.path) &&
          (item.ruleId === "add-required-param" ||
            item.ruleId === "add-param" ||
            item.ruleId === "add-optional-param" ||
            item.ruleId === "delete-param") &&
          (item.param === param.param || item.param === closest.param.param)
        );
      });

      // add the rename
      retVal.push({
        ruleId: "rename-param",
        message: `\`${param.path}\` (*${param.method}*) - Param \`${param.param}\` renamed to \`${closest.param.param}\``,
        messageHtml: `Param <code>${param.param}</code> renamed to <code>${closest.param.param}</code>`,
        path: param.path,
        method: param.method,
        param: param.param,
        newParam: closest.param.param,
        type: "renamed"
      });
    }
  }

  return retVal;
}

/**
 * Builds a changelog from a diff
 * @param  {Object} diff a diff array from diff()
 * @return {Object}      the resulting diff
 * {
 *  paragraph: string, the textual representation of the changelog
 *  items: string[], each item in an array for furthur modification
 *  diff: array, the entire diff
 * }
 */
function buildChangelog(diff) {
  const retVal = {
    paragraph: "",
    messages: [],
    diff: diff,
    unmatched: []
  };

  /**
   * Set messages for each item
   */
  diff = diff.map(d => {
    d.name = TYPE_MAP[d.type].name;
    return d;
  });

  const messages = diff.reduce((res, item) => {
    if (item.ruleId == "edit-description") {
      res.push(
        `- **${TYPE_MAP[item.type].name}**: \`${
          item.descriptionPath
        }\` : Description Updated`
      );
    } else if (item.type == "unmatchDiffs") {
      return res;
    } else {
      if (item.messageHtml) {
        res.push(item.messageHtml);
      } else {
        res.push(`- **${TYPE_MAP[item.type].name}**: ${item.message}`);
      }
    }

    return res;
  }, []);

  // Array of messages
  retVal.messages = retVal.messages.concat(messages);

  // One string of all messages
  retVal.paragraph = retVal.messages.join("\n");
  return retVal;
}

/**
 * Generate a changelog between two swagger specs
 * @param  {Object} oldSpec a valid swagger spec
 * @param  {Object} newSpec a valid swagger spec
 * @param  {Object} config settings for detection:
 * {
 *  thresholds: { // settings for thresholds
 *    endpoint: float, set the ratio threshold that counts as a match, 0-1.0 (higher means closer)
 *    param: float, set the ratio threshold that counts as a match, 0-1.0 (higher means closer)
 *  }
 * }
 * @return {Promise}        resolves with an object @see buildChangelog
 */
function changelog(oldSpec, newSpec, config) {
  config = config || {};
  const detectConfig = {
    thresholds: config.thresholds || {}
  };

  return diff(oldSpec, newSpec, config)
    .then(res => {
      return buildChangelog(detectRenames(res, detectConfig));
    })
    .catch(err => {
      throw err;
    });
}

module.exports = {
  diff,
  detectRenames,
  buildChangelog,
  changelog
};

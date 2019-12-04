module.exports = async function mergeSpecWithChanges(diff, newSpec) {
  const paths = newSpec.paths;

  diff = diff.map(d => {
    pathDetails = paths[d.path];
    if (!pathDetails) {
      return d;
    }
    pathDetailKeys = Object.keys(pathDetails);

    let firstPath = pathDetails[pathDetailKeys[0]];
    if (firstPath) {
      //console.log("Object.keys(pathDetails)", Object.keys(pathDetails));

      if (firstPath.tags) {
        //console.log("pathDetails.tags", firstPath.tags);
        if (firstPath.tags.length > 0) {
          d.group = firstPath.tags[0];
        }
      } else {
        d.group = "Other Changes";
      }

      if (d.method) {
        if (Object.keys(pathDetails).includes(d.method)) {
          d.apiDetails = pathDetails[d.method];
        }
      } else {
        d.apiDetails = pathDetails;
      }

      return d;
    } else {
      return d;
    }
  });

  return diff;
};

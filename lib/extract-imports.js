module.exports = function (src) {
  var importRegexp = /import.*?from\s+['|"](.*?)['|"]/gm;
  var match;
  var modules = [];
  while(match = importRegexp.exec(src)) {
    modules.push(match[1]);
  }
  return modules;
};

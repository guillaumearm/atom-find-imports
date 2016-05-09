module.exports = function (src) {
  var importRegexp = /import.*?from\s+['|"](.*?)['|"]/gm;
  var requireRegexp = /require\s*\(['|"](.*?)['|"]\)/gm;
  var modules = [];
  var matchRegexp = function(regexp) {
    var match;
    while(match = regexp.exec(src)) {
      modules.push(match[1]);
    }
  }

  matchRegexp(requireRegexp)
  matchRegexp(importRegexp)
  return modules;
};

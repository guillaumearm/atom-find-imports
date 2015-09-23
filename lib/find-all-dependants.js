var glob = require('glob');
var path = require('path');
var fs = require('fs');
var resolve = require('resolve').sync;
var findRoot = require('./find-root');
var extractImports = require('./extract-imports');

module.exports = function (filePath, callback) {
  var root = findRoot(filePath);
  if (!root) {
    callback([]);
  }
  
  glob('/!(node_modules)/**/*.js', {root: root}, function (err, files) {
    if (err) throw err;

    var dependants = [];
    files.forEach(function (file) {
      var src = fs.readFileSync(file, 'utf8');
      try {
        var dependencies = extractImports(src);
        dependencies.forEach(function (dependency) {
          if (dependency[0] === '.') {
            var fullPath = resolve(dependency, {basedir: path.dirname(file)});
            if (fullPath.toLowerCase() === filePath.toLowerCase()) {
              dependants.push(file);
            }
          }
        });
      } catch (e) {
        console.log('Failed for', file, e);
      }
    });
    callback && callback(dependants);
  });
}

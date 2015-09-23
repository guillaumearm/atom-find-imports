var path = require('path');
var fs = require('fs');

module.exports = function (filePath) {
  var root;
  var currentDir = path.dirname(filePath);
  var i = 0;

  while (true) {
    try {
      var stats = fs.statSync(path.join(currentDir, 'package.json'));
      return currentDir;
    } catch(e) {}
    currentDir = path.dirname(currentDir);
    i++;

    if (i > 20) {
      console.error('Unable to find package.json');
      return false;
    }
  }
}

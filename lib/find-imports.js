var CompositeDisposable = require('atom').CompositeDisposable;
var findAllDependants = require('./find-all-dependants');
var findRoot = require('./find-root');

var self = module.exports = {
  element: null,
  findImportsView: null,
  panel: null,
  subscriptions: null,
  activate: function (state) {
    self.element = document.createElement('div');
    self.element.classList.add('find-imports');

    self.element.addEventListener('click', self.onClick);

    self.panel = atom.workspace.addBottomPanel({
      item: self.element,
      visible: false
    });

    self.subscriptions = new CompositeDisposable();

    self.subscriptions.add(
      atom.commands.add(
        'atom-workspace',
        'find-imports:toggle',
        function () {
          self.toggle();
        }
      )
    );
  },
  onClick: function (e) {
    if (e.target.nodeName === 'LI') {
      var file = e.target.getAttribute('data-file');
      if (file) {
        atom.workspace.open(file);
      }
    }
    self.panel.hide();
  },
  deactivate: function () {
    self.panel.destroy();
    self.dispose();
    self.element.removeEventListener('click', self.onClick);
    self.element.remove();
  },
  serialize: function () {
    return {};
  },
  toggle: function () {
    if (self.panel.isVisible()) {
      self.panel.hide();
    } else {
      var editor = atom.workspace.getActivePaneItem();
      if (editor) {
        var file = editor.buffer.file;
        if (file) {
          var path = file.path;
          var root = findRoot(path);
          findAllDependants(path, function (dependants) {
            var html = '<ul>';
            dependants.forEach(function (dependant) {
              html += '<li data-file="' + dependant + '">' + dependant.replace(root, '') + '</li>';
            });
            html += '</ul>';
            self.element.innerHTML = html;
          });
        }
      }

      self.panel.show();
    }
  }
};

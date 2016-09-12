// Require Node modules in the browser thanks to Browserify: http://browserify.org
var bespoke = require('bespoke'),
  voltaire = require('bespoke-theme-voltaire'),
  keys = require('bespoke-keys'),
  touch = require('bespoke-touch'),
  bullets = require('bespoke-bullets'),
  backdrop = require('bespoke-backdrop'),
  scale = require('bespoke-scale'),
  hash = require('bespoke-hash'),
  progress = require('bespoke-progress'),
  forms = require('bespoke-forms'),
  prismRefresher = require('./bespoke-prism-refresher'),
  babelRepl = require('./bespoke-babel-repl'),
  snackbar = require('./bespoke-snackbar')({ snackbarSelector: '.snackbar' }),
  remoteSync = require('./bespoke-remote-sync')

// Bespoke.js
bespoke.from('article', [
  voltaire(),
  keys(),
  touch(),
  bullets('li, .bullet'),
  backdrop(),
  scale(),
  hash(),
  progress(),
  forms(),
  prismRefresher(),
  babelRepl({ exceptionHandler: snackbar.exceptionHandler }),
  snackbar(),
  remoteSync({
    projectId: 'es6-es7-lnl',
    apiKey: 'AIzaSyAvasEA1mR0f2s6mmoH-0bdwZfH3fw4m0M',
    exceptionHandler: snackbar.exceptionHandler,
  }),
]);

// Prism syntax highlighting
// This is actually loaded from "bower_components" thanks to
// debowerify: https://github.com/eugeneware/debowerify
require('prism');

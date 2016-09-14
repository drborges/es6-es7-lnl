// Require Node modules in the browser thanks to Browserify: http://browserify.org
var bespoke = require('bespoke'),
  firebase = require('firebase'),
  voltaire = require('bespoke-theme-voltaire'),
  keys = require('bespoke-keys'),
  touch = require('bespoke-touch'),
  backdrop = require('bespoke-backdrop'),
  scale = require('bespoke-scale'),
  hash = require('bespoke-hash'),
  progress = require('bespoke-progress'),
  forms = require('bespoke-forms'),
  prismRefresher = require('./bespoke-prism-refresher'),
  babelRepl = require('./bespoke-babel-repl'),
  snackbar = require('./bespoke-snackbar')({ snackbarSelector: '.snackbar' }),
  remoteSyncSlide = require('./bespoke-remote-sync-slide'),
  remoteSyncElements = require('./bespoke-remote-sync-elements'),
  remoteHighlight = require('./bespoke-remote-highlight'),
  proxyConsoleLog = require('./bespoke-proxy-console-log'),
  loginIfNeeded = require('./firebase-login')

firebase.initializeApp({
  apiKey: 'AIzaSyAvasEA1mR0f2s6mmoH-0bdwZfH3fw4m0M',
  authDomain: "es6-es7-lnl.firebaseapp.com",
  databaseURL: "https://es6-es7-lnl.firebaseio.com",
  storageBucket: "gs://es6-es7-lnl.appspot.com",
})

var remoteSyncOptions = {
  firebase: firebase,
  isPresenter: location.search.indexOf('mode=presenter') > 0
}

if (remoteSyncOptions.isPresenter) {
  loginIfNeeded(firebase, initializeDeck)
} else {
  initializeDeck()
}

function initializeDeck() {
  // Bespoke.js
  bespoke.from('article', [
    voltaire(),
    keys(),
    touch(),
    backdrop(),
    scale(),
    hash(),
    progress(),
    forms(),
    prismRefresher(),
    babelRepl({ exceptionHandler: snackbar.exceptionHandler }),
    snackbar(),
    proxyConsoleLog(),
    remoteSyncSlide(remoteSyncOptions),
    remoteSyncElements(remoteSyncOptions),
    remoteHighlight(remoteSyncOptions),
  ])

  // Prism syntax highlighting
  // This is actually loaded from "bower_components" thanks to
  // debowerify: https://github.com/eugeneware/debowerify
  require('prism')
}

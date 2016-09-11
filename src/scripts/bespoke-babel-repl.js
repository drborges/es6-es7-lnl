var babel = require("babel-core");
var options = {
  presets: [
    require("babel-preset-es2015"),
    require("babel-preset-es2016"),
    require("babel-preset-es2017"),
    require("babel-preset-stage-0"),
  ],
  plugins: [
    require("babel-plugin-transform-async-to-generator"),
  ]
}

function eventListener(source, target, exceptionHandler) {
  return function(event) {
    exceptionHandler(function() {
      target.textContent = babel.transform(source.textContent, options).code
      target.dispatchEvent(new Event('blur'))
    })
  }
}

module.exports = function(options) {
  var exceptionHandler = options.exceptionHandler || function(fn) { fn() }

  return function() {
    var repls = document.querySelectorAll('.repl')
    repls.forEach(function(repl) {
      var source = repl.querySelector('pre.source code[contenteditable=true]')
      var target = repl.querySelector('pre.target code[contenteditable=true]')

      window.addEventListener('load', eventListener(source, target, exceptionHandler))
      source.addEventListener('blur', eventListener(source, target, exceptionHandler))
    })
  }
}

var babel = require("babel-core");
var options = {
  presets: [
    require("babel-preset-es2015"),
    require("babel-preset-es2016"),
    require("babel-preset-es2017"),
    require("babel-preset-stage-0"),
  ]
}

function traspileEventListener(source, target, exceptionHandler) {
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
    var transpilers = document.querySelectorAll('.transpiler')
    transpilers.forEach(function(transpiler) {
      var source = transpiler.querySelector('pre.source code[contenteditable=true]')
      var target = transpiler.querySelector('pre.target code[contenteditable=true]')

      window.addEventListener('load', traspileEventListener(source, target, exceptionHandler))
      source.addEventListener('blur', traspileEventListener(source, target, exceptionHandler))
    })
  }
}

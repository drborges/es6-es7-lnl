require("babel-polyfill")
var babel = require("babel-core")

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

function transpileAndEvaluate(source, target, output, exceptionHandler) {
  return function(event) {
    exceptionHandler(function() {
      var transpiledCode = babel.transform(source.textContent, options).code

      if (target) {
        target.textContent = transpiledCode
        target.dispatchEvent(new Event('blur'))
      }

      if (output) {
        output.textContent = "> " + eval(transpiledCode.replace('use strict', ''))
      }
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
      var output = repl.querySelector('pre.output code')

      window.addEventListener('load', transpileAndEvaluate(source, target, output, exceptionHandler))
      source.addEventListener('blur', transpileAndEvaluate(source, target, output, exceptionHandler))
    })
  }
}

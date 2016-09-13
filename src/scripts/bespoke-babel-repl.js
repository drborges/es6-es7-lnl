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
        var evaluationResult = JSON.stringify(eval(transpiledCode.replace('use strict', '')))
        output.textContent = "> " + evaluationResult
        output.dispatchEvent(new Event('blur'))
      }
    })
  }
}

module.exports = function(options) {
  var exceptionHandler = options.exceptionHandler || function(fn) { fn() }
  return function(deck) {
    var eventHandlers = {}

    deck.on('activate', function(e) {
      var repls = e.slide.querySelectorAll('.repl')
      for (var i = 0; i < repls.length; ++i) {
        var repl = repls[i]
        var source = repl.querySelector('pre.source code')
        var target = repl.querySelector('pre.target code')
        var output = repl.querySelector('pre.output code')
        eventHandlers[e.index] = eventHandlers[e.index] || {}
        eventHandlers[e.index]['blur'] = transpileAndEvaluate(source, target, output, exceptionHandler)
        eventHandlers[e.index]['click'] = transpileAndEvaluate(source, target, output, exceptionHandler)

        source.addEventListener('blur', eventHandlers[e.index]['blur'])
        if (output) {
          output.textContent = "> "
          output.addEventListener('click', eventHandlers[e.index]['click'])
        }
      }
    })

    deck.on('deactivate', function(e) {
      var repls = e.slide.querySelectorAll('.repl')
      for (var i = 0; i < repls.length; ++i) {
        var repl = repls[i]
        var source = repl.querySelector('pre.source code')
        var target = repl.querySelector('pre.target code')
        var output = repl.querySelector('pre.output code')

        output.textContent = "> "
        source.removeEventListener('blur', eventHandlers[e.index]['blur'])
        output.removeEventListener('click', eventHandlers[e.index]['click'])
      }
    })
  }
}

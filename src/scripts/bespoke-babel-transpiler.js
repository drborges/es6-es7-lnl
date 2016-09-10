var babel = require("babel-core");
var options = {
  presets: [
    require("babel-preset-es2015"),
    require("babel-preset-es2016"),
    require("babel-preset-es2017"),
    require("babel-preset-stage-0"),
  ]
}

function transpile(source, target) {
  target.textContent = babel.transform(source.textContent, options).code
  target.dispatchEvent(new Event('blur'))
}

module.exports = function() {
  return function() {
    var transpilers = document.querySelectorAll('.transpiler')
    transpilers.forEach(function(transpiler) {
      var source = transpiler.querySelector('pre.source code[contenteditable=true]')
      var target = transpiler.querySelector('pre.target code[contenteditable=true]')

      window.addEventListener('load', function(event) {
        transpile(source, target)
      })

      source.addEventListener('blur', function(event) {
        transpile(source, target)
      })
    })
  }
}

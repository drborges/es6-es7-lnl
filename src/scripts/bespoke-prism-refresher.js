var beautify = require('js-beautify').js_beautify

function prettify(code) {
  return function(event) {
    code.textContent = beautify(code.textContent, { indent_size: 2 })
    Prism.highlightElement(code)
  }
}

module.exports = function prismRefresher() {
  return function() {
    var codeBlocks = document.querySelectorAll('pre code')

    for (var i = 0; i < codeBlocks.length; ++i) {
      var codeBlock = codeBlocks[i]
      window.addEventListener('load', prettify(codeBlock))
      codeBlock.addEventListener('blur', prettify(codeBlock))
    }
  }
};

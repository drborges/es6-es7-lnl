var beautify = require('js-beautify').js_beautify

function prettify(code) {
  code.textContent = beautify(code.textContent, { indent_size: 2 })
  Prism.highlightElement(code)
}

module.exports = function prismRefresher() {
  return function() {
    var codeBlocks = document.querySelectorAll('pre code[contenteditable=true]')

    codeBlocks.forEach(function(codeBlock) {
      window.addEventListener('load', function(event) {
        prettify(codeBlock)
      })

      codeBlock.addEventListener('blur', function(event) {
        prettify(codeBlock)
      })
    })
  }
};

/*
 * Wrap console.log within a proxy so we can capture
 * logged information and output on the UI as well
 */
function createConsoleLogProxy() {
  return function(logger) {
    var history = []

    window.console.log = function() {
      history.push(Array.from(arguments).join(' '))
      updateElementContent(logger, history.join("\n"))
    }
  }
}

function updateElementContent(element, content) {
  if (element) {
    element.textContent = content
    element.dispatchEvent(new Event('blur'))
  }
}

module.exports = function() {
  return function(deck) {
    var consoleLogProxy = createConsoleLogProxy()
    deck.on('activate', function(e) {
      var logger = e.slide.querySelector('.logger')
      if (logger) {
        consoleLogProxy(logger)
        logger.addEventListener('click', function() { updateElementContent(logger, '') })
      }
    })

    deck.on('deactivate', function(e) {
      var logger = e.slide.querySelector('.logger')
      if (logger) {
        updateElementContent(logger, '')
      }
    })
  }
}

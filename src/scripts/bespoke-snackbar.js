function hide(snackbar) {
  if (snackbar) {
    snackbar.classList.add('hidden')
  }
}

function show(snackbar, message) {
  if (snackbar) {
    snackbar.textContent = message.split("\n")[0]
    snackbar.classList.remove('hidden')
  }
}

module.exports = function(options) {
  var timeout;
  var snackbar;

  var plugin = function() {
    return function(deck) {
      snackbar = document.querySelector(options.snackbarSelector)
      deck.on('next', function() { hide(snackbar) })
      deck.on('prev', function() { hide(snackbar) })
      deck.on('slide', function() { hide(snackbar) })
    }
  }

  plugin.exceptionHandler = function exceptionHandler(fn) {
    clearTimeout(timeout)

    try {
      hide(snackbar)
      fn()
    } catch(e) {
      show(snackbar, e.message)
      timeout = setTimeout(function() { hide(snackbar) }, 5000)
    }
  }

  return plugin
}

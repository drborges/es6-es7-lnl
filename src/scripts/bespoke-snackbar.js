module.exports = function(options) {
  var plugin = function() {
    return function() {
      window.addEventListener('load', function() {
        // If no selector is provided, the document is used to handle snackbar events
        var snackbar = document.querySelector(options.snackbarSelector) || document

        snackbar.addEventListener('snackbar', function(e) {
          snackbar.textContent = e.detail.message
          snackbar.classList.remove('hidden')
          setTimeout(function() { snackbar.classList.add('hidden') }, 5000)
        })
      })
    }
  }

  plugin.exceptionHandler = function(fn) {
    try {
      fn()
    } catch(e) {
      var snackbar = document.querySelector(options.snackbarSelector)
      snackbar.dispatchEvent(new CustomEvent('snackbar', { 'detail': { message: e, level: 'error' }}))
    }
  }

  return plugin
}

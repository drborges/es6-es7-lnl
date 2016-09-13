function updateHighlight(snapshot) {
  var element = document.getElementById(snapshot.key)
  if (snapshot.val() == 'on') {
    element.classList.add('highlight')
  } else {
    element.classList.remove('highlight')
  }
}

function syncHighlight(element, elementRef) {
  if (element.id) {
    element.addEventListener('mouseover', turn(elementRef, 'on'))
    element.addEventListener('mouseleave', turn(elementRef, 'off'))
  }
}

function turn(ref, value) {
  return function() {
    ref.set(value)
  }
}

module.exports = function remoteHighlight(options) {
  return function(deck) {
    var database = options.firebase.database()
    var highlightsRef = database.ref('/deck/highlights')

    highlightsRef.on('child_added', updateHighlight)
    highlightsRef.on('child_changed', updateHighlight)

    if (options.isPresenter) {
      var firebaseHighlights = document.querySelectorAll('.firebase-highlight')
      for (var i = 0; i < firebaseHighlights.length; i++) {
        var element = firebaseHighlights[i]
        var elementRef = highlightsRef.child(element.id)
        syncHighlight(element, elementRef)
      }
    }
  }
}

function activatePresenterMode(deck, currentSlideRef) {
  currentSlideRef.set(0)
  deck.on('activate', function(e) {
    currentSlideRef.set(e.index)
  })
}

function syncElementsToFirebase(elementsRef, firebaseElements) {
  for (var i = 0; i < firebaseElements.length; i++) {
    syncElementStateToFirebase(firebaseElements[i], elementsRef)
  }
}

function syncElementStateToFirebase(element, elementsRef) {
  if (element.contentEditable && element.id) {
    var elementRef = elementsRef.child(element.id)
    window.addEventListener('load', function() {
      elementRef.set(element.textContent)
    })

    element.addEventListener('keyup', function(event) {
      elementRef.set(element.textContent)
    })

    element.addEventListener('blur', function(event) {
      elementRef.set(element.textContent)
    })
  }
}

function syncElementsFromFirebase(elementsRef, firebaseElements) {
  for (var i = 0; i < firebaseElements.length; i++) {
    syncElementFromFirebase(firebaseElements[i], elementsRef)
  }
}

function syncElementFromFirebase(element, elementsRef) {
  if (element.contentEditable && element.id) {
    var elementRef = elementsRef.child(element.id)
    elementRef.on('value', function(snapshot) {
      element.textContent = snapshot.val()
      element.dispatchEvent(new Event("blur"))
    })
  }
}

module.exports = function(options) {
  return function(deck) {
    var firebase = options.firebase
    var database = firebase.database()
    var currentSlideRef = database.ref('/deck/slide')
    var elementsRef = database.ref('/deck/remote-sync')
    var firebaseElements = document.querySelectorAll('.remote-sync')

    if (options.isPresenter) {
      activatePresenterMode(deck, currentSlideRef)
      syncElementsToFirebase(elementsRef, firebaseElements)
    } else {
      syncElementsFromFirebase(elementsRef, firebaseElements)
    }

    currentSlideRef.on('value', function(snapshot) {
      deck.slide(snapshot.val())
    })
  }
}

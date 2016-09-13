function activatePresenterMode(auth, deck, currentSlideRef, elementsRef, firebaseElements, exceptionHandler) {
  var username = window.prompt("Presenter email:")
  var password = window.prompt("Presenter password:")

  auth.signInWithEmailAndPassword(username, password).then(function(resp) {
    currentSlideRef.set(0)
    syncElementsToFirebase(elementsRef, firebaseElements)

    deck.on('activate', function(e) {
      currentSlideRef.set(e.index)
    })
  }).catch(function(error) {
    exceptionHandler(function() {
      throw error
    })
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

function isPresenterModeOn() {
  return location.search.indexOf('mode=presenter') > 0
}

module.exports = function(options) {
  return function(deck) {
    var firebase = options.firebase
    var exceptionHandler = options.exceptionHandler || function(fn) { fn() }
    var database = firebase.database()
    var currentSlideRef = database.ref('/deck/slide')
    var elementsRef = database.ref('/deck/elements')
    var firebaseElements = document.querySelectorAll('.firebase-element')

    if (isPresenterModeOn()) {
      activatePresenterMode(firebase.auth(), deck, currentSlideRef, elementsRef, firebaseElements, exceptionHandler)
    } else {
      syncElementsFromFirebase(elementsRef, firebaseElements)
    }

    currentSlideRef.on('value', function(snapshot) {
      deck.slide(snapshot.val())
    })
  }
}

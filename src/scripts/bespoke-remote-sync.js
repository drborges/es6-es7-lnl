var firebase = require('firebase')

function activatePresenterMode(deck, currentSlideRef, elementsRef, firebaseElements, exceptionHandler) {
  var username = window.prompt("Presenter email:")
  var password = window.prompt("Presenter password:")

  firebase.auth().signInWithEmailAndPassword(username, password).then(function(resp) {
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
    syncElementStateToFirebase(firebaseElements[i], elementsRef.path)
  }
}

function syncElementStateToFirebase(element, firebaseBasePath) {
  if (element.contentEditable && element.id) {
    var elementRef = firebase.database().ref(firebaseBasePath + "/" + element.id)
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
    syncElementFromFirebase(firebaseElements[i], elementsRef.path)
  }
}

function syncElementFromFirebase(element, firebaseBasePath) {
  if (element.contentEditable && element.id) {
    var elementRef = firebase.database().ref(firebaseBasePath + "/" + element.id)
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
  firebase.initializeApp({
    apiKey: options.apiKey,
    authDomain: options.projectId + ".firebaseapp.com",
    databaseURL: "https://" + options.projectId + ".firebaseio.com",
    storageBucket: "gs://" + options.projectId + ".appspot.com",
  })

  return function(deck) {
    var exceptionHandler = options.exceptionHandler || function(fn) { fn() }
    var database = firebase.database()
    var currentSlideRef = database.ref('/deck/slide')
    var elementsRef = database.ref('/deck/elements')
    var firebaseElements = document.querySelectorAll('.firebase-element')

    if (isPresenterModeOn()) {
      activatePresenterMode(deck, currentSlideRef, elementsRef, firebaseElements, exceptionHandler)
    } else {
      syncElementsFromFirebase(elementsRef, firebaseElements)
    }

    currentSlideRef.on('value', function(snapshot) {
      deck.slide(snapshot.val())
    })
  }
}

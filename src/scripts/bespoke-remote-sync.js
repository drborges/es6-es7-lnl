var firebase = require('firebase')

function activatePresenterMode(deck, currentSlideRef, exceptionHandler) {
  var username = window.prompt("Presenter email:")
  var password = window.prompt("Presenter password:")

  firebase.auth().signInWithEmailAndPassword(username, password).then(function(resp) {
    currentSlideRef.set(0)
    deck.on('activate', function(e) {
      currentSlideRef.set(e.index)
    })
  }).catch(function(error) {
    exceptionHandler(function() {
      throw error
    })
  })
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

    if (location.search.indexOf('mode=presenter') > 0) {
      activatePresenterMode(deck, currentSlideRef, exceptionHandler)
    }

    currentSlideRef.on('value', function(snapshot) {
      deck.slide(snapshot.val())
    })
  }
}

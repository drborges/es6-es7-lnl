function syncSlideToFirebase(deck, currentSlideRef) {
  currentSlideRef.set(0)
  deck.on('activate', function(e) {
    currentSlideRef.set(e.index)
  })
}

function syncSlideFromFirebase(deck, currentSlideRef) {
  currentSlideRef.on('value', function(snapshot) {
    deck.slide(snapshot.val())
  })
}

module.exports = function(options) {
  return function(deck) {
    var firebase = options.firebase
    var database = firebase.database()
    var currentSlideRef = database.ref('/deck/slide')

    if (options.isPresenter) {
      syncSlideToFirebase(deck, currentSlideRef)
    } else {
      syncSlideFromFirebase(deck, currentSlideRef)
    }
  }
}

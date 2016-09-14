module.exports = function(firebase) {
  return function(deck) {
    var database = firebase.database()
    var presenceRef = database.ref('/presence')
    var userRef = presenceRef.push()
    var connectedRef = database.ref('/.info/connected')
    var presenceCounter = document.querySelector('.presence-counter .counter')

    connectedRef.on("value", function(snap) {
      if (snap.val()) {
        userRef.onDisconnect().remove()
        userRef.set(true)
      }
    })

    presenceRef.on("value", function(snap) {
      if (presenceCounter) {
        presenceCounter.textContent = snap.numChildren()
      }
    })
  }
}

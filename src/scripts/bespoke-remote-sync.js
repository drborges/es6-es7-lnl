var firebase = require('firebase')

module.exports = function(options) {
  var config = {
    apiKey: options.apiKey,
    authDomain: options.projectId + ".firebaseapp.com",
    databaseURL: "https://" + options.projectId + ".firebaseio.com",
    storageBucket: "gs://" + options.projectId + ".appspot.com",
  }

  return function(deck) {
    firebase.initializeApp(config)
    var database = firebase.database()
    var ref = database.ref('/deck/slide')

    ref.on('value', function(snapshot) {
      deck.slide(snapshot.val())
    })
  }
}

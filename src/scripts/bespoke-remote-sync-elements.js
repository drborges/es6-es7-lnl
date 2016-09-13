function syncElementsToFirebase(remoteSyncRef, firebaseElements) {
  for (var i = 0; i < firebaseElements.length; i++) {
    syncElementToFirebase(firebaseElements[i], remoteSyncRef)
  }
}

function syncElementToFirebase(element, remoteSyncRef) {
  if (element.contentEditable && element.id) {
    var elementRef = remoteSyncRef.child(element.id)
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

function syncElementsFromFirebase(remoteSyncRef, firebaseElements) {
  for (var i = 0; i < firebaseElements.length; i++) {
    syncElementFromFirebase(firebaseElements[i], remoteSyncRef)
  }
}

function syncElementFromFirebase(element, remoteSyncRef) {
  if (element.contentEditable && element.id) {
    var elementRef = remoteSyncRef.child(element.id)
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
    var remoteSyncRef = database.ref('/deck/remote-sync')
    var firebaseElements = document.querySelectorAll('.remote-sync')

    if (options.isPresenter) {
      syncElementsToFirebase(remoteSyncRef, firebaseElements)
    } else {
      syncElementsFromFirebase(remoteSyncRef, firebaseElements)
    }
  }
}

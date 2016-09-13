function syncElementsToFirebase(remoteSyncRef, firebaseElements) {
  for (var i = 0; i < firebaseElements.length; i++) {
    syncElementToFirebase(firebaseElements[i], remoteSyncRef)
  }
}

function syncElementToFirebase(element, remoteSyncRef) {
  if (element.id) {
    var elementRef = remoteSyncRef.child(element.id)
    var updateRef = function(ref, elm) {
      return function() {
        ref.set(elm.textContent)
      }
    }

    window.addEventListener('load', updateRef(elementRef, element))
    element.addEventListener('keyup', updateRef(elementRef, element))
    element.addEventListener('blur', updateRef(elementRef, element))
  }
}

function syncElementsFromFirebase(remoteSyncRef, firebaseElements) {
  for (var i = 0; i < firebaseElements.length; i++) {
    syncElementFromFirebase(firebaseElements[i], remoteSyncRef)
  }
}

function syncElementFromFirebase(element, remoteSyncRef) {
  if (element.id) {
    var elementRef = remoteSyncRef.child(element.id)
    elementRef.on('value', function(snapshot) {
      var val = snapshot.val()
      if (val != null) {
        element.textContent = snapshot.val()
        element.dispatchEvent(new Event("blur"))
      }
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

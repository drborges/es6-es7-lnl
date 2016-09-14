function loginIfNeeded(firebase) {
  return function(result) {
    if (!result) {
      return login(firebase).catch(handleLoginError(firebase))
    }
  }
}

function handleLoginError(firebase) {
  return function(error) {
    var errorCode = error.code
    var errorMessage = error.message
    var tryAgain = confirm(errorMessage)

    if (tryAgain) {
      return login(firebase).catch(handleLoginError(firebase))
    } else {
      alert("Was not able to initialize deck for the presenter.")
      location.href = 'https://drborges.github.io/es6-es7-lnl'
    }
  }
}

function login(firebase) {
  var email = window.prompt('Email:')
  var password = window.prompt('Password:')
  return firebase.auth().signInWithEmailAndPassword(email, password)
}

module.exports = function(firebase, onSuccess) {
  return firebase.auth().getToken().then(loginIfNeeded(firebase)).then(onSuccess).catch(handleLoginError(firebase))
}

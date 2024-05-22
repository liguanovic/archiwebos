"use strict";

//***** FUNCTIONS ***** */
function errorMessage(message) {
  const errorMessageElement = document.getElementById("error-message");
  errorMessageElement.textContent = message;
}
function loginUser() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const loginData = {
    email: email,
    password: password
  };

  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur de connexion');
      }
      return response.json();
    })
    .then(data => {
      console.log('Connexion réussie:', data);
      window.location.href = "index.html";
    })
    .catch(error => {
      console.error('Erreur de connexion:', error.message);
      errorMessage('Erreur dans l’identifiant ou le mot de passe');
    });
}

document.getElementById('submit').addEventListener('click', function (event) {
  event.preventDefault();
  loginUser();
});

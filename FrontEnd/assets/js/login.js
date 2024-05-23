"use strict";

//***** FUNCTIONS ***** */

/**
 * Sets the error message in the DOM.
 *
 * @param {string} message - The error message to display.
 */
function errorMessage(message) {
  const errorMessageElement = document.getElementById("error-message");
  errorMessageElement.textContent = message;
}

/**
 * Logs in a user by sending a POST request to the server with the user's email and password.
 * If the login is successful, the user's token is stored in local storage and the page is redirected to index.html.
 * If the login fails, an error message is displayed.
 *
 * @return {Promise<void>} - A promise that resolves when the login is successful or rejects with an error message when the login fails.
 */
function loginUser() {
  const email     = document.getElementById('email').value;
  const password  = document.getElementById('password').value;

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
      localStorage.setItem('token', data.token);
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

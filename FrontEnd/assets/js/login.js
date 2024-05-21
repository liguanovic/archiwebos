"use strict";

// ***** CONSTANTS ***** //
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

// ***** FUNCTIONS ***** //
function errorMessage() {
  const errorMessage = document.getElementById("error-message");
  errorMessage.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
}
function login(event) {
  event.preventDefault();
  console.log(event);

  const loginData = {
    email: email.value,
    password: password.value
  };

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),

  })
    .then(response => {
      console.log(response)
      if (response.ok) {
        return response.json().then(data => {
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("token", data.token);
          window.location.href = "index.html";
        })
      } else {
        errorMessage();
      }
    })
}

document.getElementById("submit").addEventListener("click", login);



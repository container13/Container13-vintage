import { auth } from "../firebase/firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");
const resetButton = document.getElementById("resetPassword");

document.getElementById("togglePassword").onclick = () => {
  password.type = password.type === "password" ? "text" : "password";
};

async function login() {
  message.textContent = "";

  if (!email.value) {
    message.textContent = "Fyll i din e-postadress.";
    return;
  }

  if (!password.value) {
    message.textContent = "Fyll i ditt lösenord.";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    location.href = "dashboard.html";
  } catch (e) {
    password.type = "password";
    message.textContent = "Fel e-post eller lösenord. Försök igen.";
  }
}

document.getElementById("loginButton").onclick = login;

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  if (!email.value) {
    email.focus();
    message.textContent = "Fyll i din e-postadress.";
    return;
  }

  if (!password.value) {
    password.focus();
    message.textContent = "Fyll i ditt lösenord.";
    return;
  }

  login();
});

// Chrome/Edge autofill kan ändra lösenordstyp efter laddning.
// Håll lösenord dolt tills användaren själv trycker på ögat.
window.setTimeout(() => {
  if (password.type !== "text") {
    password.type = "password";
  }
}, 500);

resetButton.onclick = async () => {
  message.textContent = "";

  if (!email.value) {
    message.textContent = "Fyll i din e-postadress först.";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email.value);
    message.textContent = "Om adressen finns registrerad har instruktioner skickats.";
  } catch (e) {
    message.textContent = "Om adressen finns registrerad har instruktioner skickats.";
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) { }
});

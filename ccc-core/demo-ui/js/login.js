import { auth } from "../firebase/firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");
const resetButton = document.getElementById("resetPassword");

document.getElementById("togglePassword").onclick = () => {
  password.type = password.type === "password" ? "text" : "password";
};

document.getElementById("loginButton").onclick = async () => {
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
    message.textContent = "Fel e-post eller lösenord. Försök igen.";
  }
};

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

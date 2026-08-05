import { auth } from "../firebase/firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");
const resetButton = document.getElementById("resetPassword");
const togglePassword = document.getElementById("togglePassword");

let lastPasswordValue = password.value;
let lastUserPasswordInputAt = 0;
let autofillCheckTimer;
const rememberedEmailKey = "ccc:last-successful-login-email";

function getRememberedEmail() {
  try {
    return (localStorage.getItem(rememberedEmailKey) || "").trim();
  } catch {
    return "";
  }
}

function rememberEmail(value) {
  const normalized = value.trim();

  if (!normalized || !normalized.includes("@")) return;

  try {
    localStorage.setItem(rememberedEmailKey, normalized);
  } catch {
    // Inloggningen ska fungera även om lokal lagring är blockerad.
  }
}

function completeRememberedEmailAfterPasswordAutofill() {
  const rememberedEmail = getRememberedEmail();
  const currentEmail = email.value.trim();

  if (!rememberedEmail || !currentEmail || currentEmail === rememberedEmail) return;

  if (rememberedEmail.toLowerCase().startsWith(currentEmail.toLowerCase())) {
    email.value = rememberedEmail;
    email.dispatchEvent(new Event("input", { bubbles: true }));
    email.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function hidePassword() {
  password.type = "password";
  togglePassword.setAttribute("aria-pressed", "false");
  togglePassword.setAttribute("aria-label", "Visa lösenord");
  togglePassword.title = "Visa lösenord";
}

function showPassword() {
  password.type = "text";
  togglePassword.setAttribute("aria-pressed", "true");
  togglePassword.setAttribute("aria-label", "Dölj lösenord");
  togglePassword.title = "Dölj lösenord";
}

function checkForAutofilledPassword() {
  const valueChanged = password.value !== lastPasswordValue;
  const changedByRecentTyping = Date.now() - lastUserPasswordInputAt < 250;

  if (valueChanged && !changedByRecentTyping) {
    completeRememberedEmailAfterPasswordAutofill();

    if (password.type === "text") {
      hidePassword();
    }
  }

  lastPasswordValue = password.value;
}

function scheduleAutofillCheck() {
  clearTimeout(autofillCheckTimer);

  // Chrome kan fylla lösenordet strax efter e-postfältet.
  [0, 60, 180].forEach((delay) => {
    autofillCheckTimer = setTimeout(checkForAutofilledPassword, delay);
  });
}

hidePassword();

// beforeinput registrerar vanlig användarinmatning, men normalt inte Chromes autofyll.
password.addEventListener("beforeinput", () => {
  lastUserPasswordInputAt = Date.now();
});

password.addEventListener("input", (event) => {
  const looksLikeAutofill = event.inputType == null || event.inputType === "insertReplacementText";

  if (looksLikeAutofill) {
    completeRememberedEmailAfterPasswordAutofill();

    if (password.type === "text") {
      hidePassword();
    }
  }

  lastPasswordValue = password.value;
});

// När sparade inloggningsuppgifter väljs fylls ofta e-postfältet först.
email.addEventListener("input", scheduleAutofillCheck);
email.addEventListener("change", scheduleAutofillCheck);
password.addEventListener("change", checkForAutofilledPassword);

// Återställ alltid säkert läge när sidan återkommer från cache eller bakgrund.
window.addEventListener("pageshow", () => {
  hidePassword();
  lastPasswordValue = password.value;
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    hidePassword();
    lastPasswordValue = password.value;
  }
});

togglePassword.onclick = () => {
  if (password.type === "password") {
    showPassword();
  } else {
    hidePassword();
  }
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
    rememberEmail(email.value);
    location.href = "dashboard.html";
  } catch (e) {
    hidePassword();
    message.textContent = "Fel e-post eller lösenord. Försök igen.";
  }
}

document.getElementById("loginButton").onclick = login;

const form = password.form;

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (document.activeElement === email && !password.value) {
    password.focus();
    return;
  }

  login();
});

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

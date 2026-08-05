import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
const firebaseConfig = {
 apiKey:"REPLACE_WITH_C13_CONFIG",
 authDomain:"container13-87c1a.firebaseapp.com",
 projectId:"container13-87c1a"
};
const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
export {auth};

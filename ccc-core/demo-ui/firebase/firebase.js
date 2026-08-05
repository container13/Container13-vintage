import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDWaTS_Yyo5X-skYiJ5nQYX5Jc5ZSa1tw",
  authDomain: "container13-87c1a.firebaseapp.com",
  projectId: "container13-87c1a",
  storageBucket: "container13-87c1a.firebasestorage.app",
  messagingSenderId: "936924614149",
  appId: "1:936924614149:web:2b74d823951538fa2b166c",
  measurementId: "G-PSHRGK4JJC"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

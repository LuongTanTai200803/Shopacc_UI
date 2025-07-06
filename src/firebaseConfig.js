
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBfjprSNVR6DTu3GYfZTMbM-7NnrkCmGss",
  authDomain: "authorization-de9a5.firebaseapp.com",
  projectId: "authorization-de9a5",
  appId: "1:1057456903168:web:bd5cd21865e2ae6532b4e5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };

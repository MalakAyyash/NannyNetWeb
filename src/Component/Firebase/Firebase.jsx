import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyCQydCIvUJk2UHXKh8P2fipdtAoMGsFypQ",
  authDomain: "nannynet-eeaf8.firebaseapp.com",
  projectId: "nannynet-eeaf8",
  storageBucket: "nannynet-eeaf8.appspot.com",
  messagingSenderId: "800445434332",
  appId: "1:800445434332:web:a82ea58c4fb2fda04ee719",
  measurementId: "G-H01C0H4FDQ"
};
// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);
const storage = getStorage(firebase); // Use getStorage to initialize Firebase Storage
// const analytics = getAnalytics(app);
export { storage, database, firebase };




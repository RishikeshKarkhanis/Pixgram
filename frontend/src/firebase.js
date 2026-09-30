import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDGELGBiNpwa-XPeCqFh_6UCIL2a_dwUlY",
  authDomain: "pixgram-469807.firebaseapp.com",
  projectId: "pixgram-469807",
  storageBucket: "pixgram-469807.firebasestorage.app",
  messagingSenderId: "724605495978",
  appId: "1:724605495978:web:2eeb49d8d5a77463d97ed3",
  measurementId: "G-2H46J6S53H"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const storage = getStorage(app);

export { app, analytics, storage };
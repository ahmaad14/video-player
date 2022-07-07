import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore" 
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAuARbhdaplYPlHXWDOm2Yh5151w0Udh3Y",  // to be moved to .env file 
  authDomain: "wellnes-db.firebaseapp.com",
  projectId: "wellnes-db",
  storageBucket: "wellnes-db.appspot.com",
  messagingSenderId: "1080513130903",
  appId: "1:1080513130903:web:ef769292ff35544c3d54d2",
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app)

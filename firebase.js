// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Gives access to the firebase data base
import { getFirestore, collection } from "firebase/firestore"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDA719F3dqltJzq8witWKB2XHBZdBfFms",
  authDomain: "notesapp-react-66254.firebaseapp.com",
  projectId: "notesapp-react-66254",
  storageBucket: "notesapp-react-66254.appspot.com",
  messagingSenderId: "829000639120",
  appId: "1:829000639120:web:e0f0ffdcb202e4c4fa2e15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// This returns an instance of the database
export const db = getFirestore(app)
// Calling a function from firebase called collection
//Pass the db/database function so firebase knows which database to find it in
// "notes" is the name of the collection I want to grab 
export const notesCollection = collection(db, "notes")
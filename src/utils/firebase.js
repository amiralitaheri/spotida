import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCnhsdrelnNGgkKSpLwQBJzEkar-fzmfJQ",
    authDomain: "spotida.firebaseapp.com",
    databaseURL: "https://spotida.firebaseio.com",
    projectId: "spotida",
    storageBucket: "spotida.appspot.com",
    messagingSenderId: "707182772471",
    appId: "1:707182772471:web:64614e1d374e44e47cd3f2",
    measurementId: "G-26TZ0DGV0X"
};

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
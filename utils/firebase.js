import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAo_xESELlNzBFv9-BEJi89W2IKZaiuUEA",
  authDomain: "morfu-bc705.firebaseapp.com",
  databaseURL: "https://morfu-bc705.firebaseio.com",
  projectId: "morfu-bc705",
  storageBucket: "morfu-bc705.appspot.com",
  messagingSenderId: "981909658319",
  appId: "1:981909658319:web:57a251b3fd951e556df5ba",
  measurementId: "G-CPTNDWRG1F",
};

firebase.initializeApp(firebaseConfig);
export const storageService = firebase.storage();
export const productosRef = firebase.firestore().collection("productosPantoja");
export const ordenesRef = firebase.firestore().collection("ordenesPantoja");

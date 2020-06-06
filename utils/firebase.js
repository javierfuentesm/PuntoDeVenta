import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/storage";
import {
  APIKEY,
  AUTHDOMAIN,
  DATABASEURL,
  PROJECTID,
  STORAGEBUCKET,
  MESSAGINGSENDERID,
  APPID,
  MEASUREMENTID,
} from "react-native-dotenv";

const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: AUTHDOMAIN,
  databaseURL: DATABASEURL,
  projectId: PROJECTID,
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID,
  measurementId: MEASUREMENTID,
};


firebase.initializeApp(firebaseConfig);
export const storageService = firebase.storage();
export const productosRef = firebase.firestore().collection("productos");
export const ordenesRef = firebase.firestore().collection("ordenes");
export const productosMiguelRef = firebase
  .firestore()
  .collection("productosMiguel");
export const ordenesMiguelRef = firebase
  .firestore()
  .collection("ordenesMiguel");

/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import App from "./src/navigator";
import { name as appName } from './app.json';
import firebase from '@react-native-firebase/app';





let firebaseConfig = {
    apiKey: "AIzaSyA7VhFm8hIda3LuuM0M7eNESJRUfdk--bM",
    authDomain: "melitrics.firebaseapp.com",
    projectId: "melitrics",
    storageBucket: "melitrics.appspot.com",
    messagingSenderId: "47192364743",
    appId: "1:47192364743:ios:57944bf23a9bd00b2250e2",
    databaseURL: "https://melitrics-default-rtdb.firebaseio.com/",
};

console.log('Firebase', Platform.OS, firebase.apps)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}


AppRegistry.registerComponent(appName, () => App);

/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import firebase from '@firebase/app';
import '@firebase/auth';

import { store } from '../store.js';
import { setUser } from '../actions/user.js';
import user from '../reducers/user.js';
store.addReducers({
  user
});

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAqhMtNd2rab820PumYm4w4AWUC9SUizt8",
  authDomain: "pwa-starter-kit-4225c.firebaseapp.com",
  databaseURL: "https://pwa-starter-kit-4225c.firebaseio.com",
  projectId: "pwa-starter-kit",
  storageBucket: "pwa-starter-kit.appspot.com",
  messagingSenderId: "246309712848"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {
  store.dispatch(setUser(user));
});

export { firebase };

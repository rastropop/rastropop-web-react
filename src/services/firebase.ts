import firebase from 'firebase/compat/app';

import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

import { FIREBASE_API } from 'config';

if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_API);
}

const auth = firebase.auth();
const fireStore = firebase.firestore();
const storage = firebase.storage();

const fireStoreFieldValue = firebase.firestore.FieldValue;
const fireStoreBatch = firebase.firestore().batch();

export { auth, fireStore, storage, fireStoreFieldValue, fireStoreBatch };

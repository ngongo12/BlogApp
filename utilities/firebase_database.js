import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

// Your web app's Firebase configuration
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDvGO58nvEKChPUoEmwoYpTm3rq-d5Aivk",
  authDomain: "mob306blogapp.firebaseapp.com",
  projectId: "mob306blogapp",
  storageBucket: "mob306blogapp.appspot.com",
  messagingSenderId: "749908385905",
  appId: "1:749908385905:web:1fc9a5550a01222f47bbd0"
};
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);


  firebaseApp.firestore().settings({experimentalForceLongPolling: true, timestampsInSnapshot: true, merge: true})
  

  export default firebaseApp
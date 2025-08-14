// REPLACE the following with your Firebase project configuration
// Get it from Firebase Console -> Project settings -> SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyAN4x0NDy9VZwRdvF45izKi29CwYrYhnvs",
  authDomain: "std-teacher-appointment.firebaseapp.com",
  projectId: "std-teacher-appointment",
  storageBucket: "std-teacher-appointment.firebasestorage.app",
  messagingSenderId: "220859350105",
  appId: "1:220859350105:web:ab32f912bddbfc5e8dc548",
  measurementId: "G-FHDMMVZJES"
};

// Initialize Firebase
if(typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgy95kvKlrrB5te4qU-3DMLLxEfMKmeZg",
    authDomain: "food-ninja-bbc1c.firebaseapp.com",
    projectId: "food-ninja-bbc1c",
    storageBucket: "food-ninja-bbc1c.appspot.com",
    messagingSenderId: "1016749536116",
    appId: "1:1016749536116:web:c35423d9b234b18cc0f221",
};

// Initialize Firebase
console.log("Menginisiasi Firebase App");
firebase.initializeApp(firebaseConfig);

//initialize DB
const db = firebase.firestore();
const citiesRef = db.collection('cities') ; 
const recipeRef = db.collection('indo-food-recipe') ; 

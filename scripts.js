// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Loader functionality
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        document.getElementById("loader").style.display = "none";
        document.getElementById("main-content").style.display = "block";
    }, 2000); // 2-second delay

    // Load user rank
    const user = auth.currentUser;
    if (user) {
        loadUserRank(user.uid);
    }
});

// Sign Up Functionality
document.getElementById('signup-btn').addEventListener('click', function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            document.getElementById('auth-message').textContent = 'Sign up successful!';

            // Save user rank in Firestore
            db.collection('users').doc(user.uid).set({
                rank: '⭐' // Default rank
            });
        })
        .catch((error) => {
            const errorMessage = error.message;
            document.getElementById('auth-message').textContent = errorMessage;
        });
});

// Login Functionality
document.getElementById('login-btn').addEventListener('click', function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            document.getElementById('auth-message').textContent = 'Login successful!';
            loadUserRank(user.uid);
        })
        .catch((error) => {
            const errorMessage = error.message;
            document.getElementById('auth-message').textContent = errorMessage;
        });
});

// Load User Rank
function loadUserRank(userId) {
    db.collection('users').doc(userId).get().then((doc) => {
        if (doc.exists) {
            const userRank = doc.data().rank;
            document.getElementById('rank-emoji').textContent = userRank;
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

// Rank emoji selector
document.querySelectorAll('.emoji').forEach(item => {
    item.addEventListener('click', event => {
        const selectedRank = event.target.getAttribute('data-emoji');
        document.getElementById('rank-emoji').textContent = selectedRank;
    });
});

// Store selected rank in Firestore
document.getElementById('apply-rank').addEventListener('click', function () {
    const selectedRank = document.getElementById('rank-emoji').textContent;
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).update({
            rank: selectedRank
        });
    }
});

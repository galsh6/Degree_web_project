localStorage.clear(); //* Clears all data stored in localStorage

const firebaseConfig = {
    apiKey: "AIzaSyBl5TS-qJnDCBB-_j0T_3Aa86GyrMnf24k", //* Firebase API key
    authDomain: "appa-5badb.firebaseapp.com", //* Firebase auth domain
    databaseURL: "https://appa-5badb-default-rtdb.europe-west1.firebasedatabase.app", //* Firebase database URL
    projectId: "appa-5badb", //* Firebase project ID
    storageBucket: "appa-5badb.appspot.com", //* Firebase storage bucket
    messagingSenderId: "155627217351", //* Firebase messaging sender ID
    appId: "1:155627217351:web:1c801477f12ee07145f9e2" //* Firebase app ID
};

//* Initialize Firebase
const app = firebase.initializeApp(firebaseConfig); //* Initialize Firebase app

//* Get auth from firebase
const auth = firebase.auth(app);

async function login() {
    const email = document.getElementById('email').value; //* Get email input value
    const password = document.getElementById('password').value; //* Get password input value
    
    if (email !== "" && password !== "") { //* Check if email and password are not empty
        try {
            await auth.signInWithEmailAndPassword(email, password); //* Sign in with email and password
            
            const uid = auth.currentUser.uid; //* Get the current user's UID
            const userdataRef = firebase.database().ref('/Data/Users/' + uid); //* Reference to the database path
            
            //* Fetch data from the database
            await userdataRef.once('value').then(function(snapshot) {
                const userData = snapshot.val();
                localStorage.setItem("userData", JSON.stringify(userData)); //* Store the user data in localStorage
                localStorage.setItem("uid", uid); //* Store the UID of the user in localStorage
            });
            
            window.location.href = '/storage.html'; //* Redirect to storage.html upon successful login
        } catch {
            Swal.fire({
                title: "your password or email is wrong",
                width: 600,
                padding: "3em",
                color: "#716add",
                background: "#fff url(https://sweetalert2.github.io/#images/trees.png)",
                backdrop: `
                  rgba(255,167,38,0.4)
                  url("https://sweetalert2.github.io/#images/nyan-cat.gif")
                  left top
                  no-repeat
                `
              });
        }
    } else {
          Swal.fire({
            title: "please enter email and password",
            width: 600,
            padding: "3em",
            color: "#716add",
            background: "#fff url(https://sweetalert2.github.io/#images/trees.png)",
            backdrop: `
              rgba(255,167,38,0.4)
              url("https://sweetalert2.github.io/#images/nyan-cat.gif")
              left top
              no-repeat
            `
          });
    }
}

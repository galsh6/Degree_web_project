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
const auth = firebase.auth(app); //* Get auth instance

//* Reference the database
const database = firebase.database(); //* Get Firebase database reference

function signup() {
    const password = document.getElementById("Password").value; //* Get password input value
    const repassword = document.getElementById("rePassword").value; //* Get re-entered password input value
    const email = document.getElementById("email").value; //* Get email input value
    
    if (password !== "" && email !== "") { //* Check if password and email are not empty
        if (password === repassword) { //* Check if passwords match
            try {
                auth.createUserWithEmailAndPassword(email, password).then(async (userdata) => {
                    const newuid = userdata.user.uid; //* Get the UID of the newly created user
                    
                    const newuser = {
                        'Email': email,
                        'Items': { none: "" },
                        'cam': {
                            'id': "none",
                            'url': ""
                        },
                        'Recipes': { none: "" }
                    };

                    const ref = database.ref('/Data/Users/' + newuid); //* Reference to the new user's path in database
                    await ref.update(newuser); //* Update user data in the database
                    
                    window.location.href = '/login.html'; //* Redirect to login.html after successful signup
                });
            } catch {
                Swal.fire({
                    title: "there was a problem with your email",
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
                 //* alert error if there's a problem with the email
            }
        } else {
            Swal.fire({
                title: "the passwords must be the same",
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
             //* alert if passwords do not match
        }
    } else {
        Swal.fire({
            title: "please enter an email and password",
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
         //* alert if email or password is empty
    }
}

//* Toggle visibility of old password
const toggleOldPassword = document.querySelector("#togglePassword");
const oldPassword = document.querySelector("#Password");

toggleOldPassword.addEventListener("click", function () {
    const type = oldPassword.getAttribute("type") === "password" ? "text" : "password"; //* Toggle password visibility
    oldPassword.setAttribute("type", type);

    this.classList.toggle('fa-eye'); //* Toggle eye icon
});

//* Toggle visibility of new password
const toggleNewPassword = document.querySelector("#togglerePassword");
const newPassword = document.querySelector("#rePassword");

toggleNewPassword.addEventListener("click", function () {
    const type = newPassword.getAttribute("type") === "password" ? "text" : "password"; //* Toggle password visibility
    newPassword.setAttribute("type", type);

    this.classList.toggle('fa-eye'); //* Toggle eye icon
});

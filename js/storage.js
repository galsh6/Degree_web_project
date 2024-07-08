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

//* Reference the database
const database = firebase.database(app); //* Reference to Firebase database

const data = JSON.parse(localStorage.getItem("userData")); //* Retrieve user data from localStorage

const items = data.Items; //* Retrieve user items
console.log(data);

const uid = localStorage.getItem("uid"); //* Retrieve user ID

function test(strtype) {
    const type = items[strtype];
    console.log(items);
}

//* Function to populate the HTML page with user data on window load
window.onload = function () {
    const html = document.getElementById("storagelist");
    let storage = ``;
    const types = Object.keys(items);
    let counttype = 0;
    
    types.forEach(typestr => {
        if (typestr !== 'none') {
            let type = items[typestr];
            let citems = Object.keys(type);
            let countrew = 0;
            
            storage += `
                <!-- //**start of type -->
                <div class="card">
                    <!-- //** start header -->
                    <div class="card-header">
                        <a class="btn" data-bs-toggle="collapse" href="#collapse${counttype}">
                            ${typestr}
                        </a>
                        <button onclick='settype("${typestr}")' type="button" class="btn-storage" data-bs-toggle="modal" data-bs-target="#myModal2">Add</button>
                        <button onclick='delete_type("${typestr}")' type="button" class="btn-storage">Delete</button>
                    </div>
                    <!-- //**end of header -->
                    
                    <!-- //**container of boxes -->
                    <div id="collapse${counttype}" class="collapse show" data-bs-parent="#accordion">
                        <!-- //** new one on 3 boxes -->
                        <div class="container mt-5">
                            <div class="row">
                                <!-- //**end container of boxes -->
            `;
            
            counttype++;
            
            citems.forEach(itemstr => {
                let item = type[itemstr];
                let camount = item.amount;
                let cweight = item.weight;
                
                if (countrew % 3 === 0 && countrew > 2) {
                    storage += ` 
                        </div>
                    </div>
                    <!--//** new one on 3 boxes -->
                    <div class="container mt-5">
                        <div class="row">
                            <!-- //**end container of boxes -->
                    `;
                }
                
                countrew++;
                
                if (itemstr !== 'none') {
                    storage += `
                        <!-- //**start of one box -->
                        <div class="shadow p-3 mb-5 bg-body rounded col-sm-3 my-5 border-5 mx-auto" style="--bs-bg-opacity: .5;">
                            <h3>${itemstr}</h3>
                            <h6>amount : ${camount}</h6>
                            <h6>weight : ${cweight}</h6>
                            <div class="button-container">
                                <button type="button" class="btn-storage" data-bs-toggle="modal" data-bs-target="#myModal" onclick="setendit('${typestr}', '${itemstr}')">Edit</button>
                                <button type="button" class="btn-storage" onclick="delete_item('${typestr}', '${itemstr}')">Delete</button>
                            </div>
                        </div>
                        <!-- //**end of box -->
                    `;
                }
            });
            
            storage += `
                            </div>
                        </div>
                    </div>
                </div>
                <!-- //**end of type -->
            `;
        }
    });
    
    html.innerHTML = storage; //* Inject the generated HTML into the 'storagelist' element
};

//* Function to delete an entire type of items
async function delete_type(type) {
    let len = Object.keys(items).length;
    
    if (len === 1) {
        const newtype = { none: "" };
        const ref = database.ref('/Data/Users/' + uid + '/Items/none');
        await ref.update(newtype); //* Update the 'none' type if this is the last type being deleted
    }
    
    const del = database.ref('/Data/Users/' + uid + '/Items/' + type);
    await del.remove(); //* Remove the specified type of items from the database
    updatels(); //* Update localStorage after deletion
}

//* Function to set the type for adding a new item
function settype(type) {
    document.getElementById("additem_bnt").addEventListener("click", function () {
        additem(type); //* Add an item of the specified type
    });
}

//* Function to set the type and item for editing
function setendit(type, item) {
    document.getElementById("edit_bnt").addEventListener("click", function () {
        edititem(type, item); //* Edit the specified item within the specified type
    });
}

//* Function to edit an item's details
async function edititem(type, item) {
    const weight = document.getElementById("weight_edit").value;
    const amount = document.getElementById("amount_edit").value;
    if (amount === "" || weight === "") {
        Swal.fire({
            title: "please enter all the criteria",
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
          return;
        }
        
    let newitem = {
        amount: amount,
        weight: weight
    };
    
    const ref = database.ref('/Data/Users/' + uid + '/Items/' + type + '/' + item);
    await ref.update(newitem); //* Update item details in the database
    updatels(); //* Update localStorage after editing
}

//* Function to delete a specific item within a type
async function delete_item(type, item) {
    let len = Object.keys(items[type]).length;
    
    if (len === 1) {
        const newtype = { none: "" };
        const ref = database.ref('/Data/Users/' + uid + '/Items/' + type);
        await ref.update(newtype); //* Update the type if this is the last item being deleted
    }
    
    const del = database.ref('/Data/Users/' + uid + '/Items/' + type + '/' + item);
    await del.remove(); //* Remove the specified item from the database
    updatels(); //* Update localStorage after deletion
}

//* Function to add a new item to a specified type
async function additem(strtype) {
    const item = document.getElementById("itemadd").value;
    const amount = document.getElementById("amountadd").value;
    const weight = document.getElementById("weightadd").value;
    const type = items[strtype];
    
    if (item === "" || amount === "" || weight === "") {
        Swal.fire({
            title: "please enter all the criteria",
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
        return;
    }
    
    let newitem = {
        amount: amount,
        weight: weight
    };
    
    const ref = database.ref('/Data/Users/' + uid + '/Items/' + strtype + '/' + item);
    await ref.update(newitem); //* Add the new item to the specified type in the database
    
    if (type.none != null) {
        const del = database.ref('/Data/Users/' + uid + '/Items/' + strtype + '/none');
        await del.remove(); //* Remove 'none' placeholder if it exists
    }
    
    updatels(); //* Update localStorage after adding the new item
}

//* Function to add a new type of items
async function addtype() {
    const type = document.getElementById("typeinput").value;
    const types = Object.keys(items);
    
    if (type === "" || types.indexOf(type) !== -1) {
        Swal.fire({
            title: "please enter a new type",
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
        return;
    }
    
    const newtype = { none: "" };
    const ref = database.ref('/Data/Users/' + uid + '/Items/' + type);
    await ref.update(newtype); //* Add the new type to the database
    
    if (types[0] === 'none' && types.length === 1) {
        const del = database.ref('/Data/Users/' + uid + '/Items/none');
        await del.remove(); //* Remove 'none' placeholder if this was the first type added
    }
    
    updatels(); //* Update localStorage after adding the new type
}

//* Function to update localStorage with the latest user data from the database
async function updatels() {
    const userdataRef = firebase.database().ref('/Data/Users/' + uid); //* Reference to the user's data in the database
    
    //* Fetch data from the database
    await userdataRef.once('value').then(function (snapshot) {
        const userData = snapshot.val();
        localStorage.setItem("userData", JSON.stringify(userData)); //* Store the updated user data in localStorage
    });
    
    window.location.reload(); //* Reload the page to reflect changes
}

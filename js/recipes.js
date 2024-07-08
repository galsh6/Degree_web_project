//* Firebase configuration object containing API keys and endpoints
const firebaseConfig = {
  apiKey: "AIzaSyBl5TS-qJnDCBB-_j0T_3Aa86GyrMnf24k",
  authDomain: "appa-5badb.firebaseapp.com",
  databaseURL: "https://appa-5badb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "appa-5badb",
  storageBucket: "appa-5badb.appspot.com",
  messagingSenderId: "155627217351",
  appId: "1:155627217351:web:1c801477f12ee07145f9e2"
};

//* Initialize Firebase with the configuration
const app = firebase.initializeApp(firebaseConfig);

//* Get a reference to the Firebase database
const database = firebase.database(app);

//* Retrieve user data from local storage
const data = JSON.parse(localStorage.getItem("userData"));

//* Extract recipes and items from the user data
const recipes = data.Recipes;
const items = data.Items;

//* Retrieve user ID from local storage
const uid = localStorage.getItem("uid");

//* Function to display recipes dynamically on the webpage
function display() {
  let html = document.getElementById("recipes_list");
  let recipes_list = `<div class="row">`;
  let names = Object.keys(recipes);
  let count = 0;

  names.forEach(namestr => {
    if (namestr != "none") {
      let name = recipes[namestr];
      let Directions = name.Directions;
      let search = document.getElementById("search").value;

      if (search == "" || namestr.includes(search)) {
        if (count % 3 == 0 && count > 2) {
          recipes_list += `</div><div class="row">`;
        }

        recipes_list += `
          <div class="shadow p-3 mb-5 bg-body rounded col-sm-3 my-5 border-5 mx-auto" style="--bs-bg-opacity: .5;">
            <h3>${namestr}</h3>
            <p style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">${Directions}</p>
            <div class="button-container">
              <button type="button" class="btn-storage" onclick='view("${namestr}")'>View</button>
              <button type="button" class="btn-storage" onclick='showedit("${namestr}")'>Edit</button>
              <button type="button" class="btn-storage" onclick='del("${namestr}")'>Delete</button>
            </div>
          </div>`;
        count++;
      }
    }
  });

  recipes_list += `</div>`;
  html.innerHTML = recipes_list;
}

//* Trigger the display function on page load
window.onload = () => { display(); };

//* Async function to delete a recipe by name
async function del(name) {
  let len = Object.keys(recipes).length;

  if (len == 1) {
    newtype = { none: "" };
    const ref = database.ref('/Data/Users/' + uid + '/Recipes/none');
    await ref.update(newtype);
  }

  let del = database.ref('/Data/Users/' + uid + '/Recipes/' + name);
  del.remove();
  updatels();
}

//* Function to display the edit modal for a specific recipe
function showedit(name) {
  let html = document.getElementById("editrecipe");
  let Directions = recipes[name].Directions;
  let Ingredients = recipes[name].Ingredients;

  html.innerHTML = `
    <div class="modal" id="editModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div>
            <form class="w-50-2 py-5 shadow p-4">
              <h3 class="text-white">Edit ${name}</h3><hr>
              <div class="mb-3">
                <label for="editingredients" class="form-label">Ingredients</label>
                <textarea class="form-control" id="editingredients" rows="8" cols="50">${Ingredients}</textarea>
              </div>
              <div class="mb-3">
                <label for="editdirections" class="form-label">Directions</label>
                <textarea class="form-control" id="editdirections" rows="8" cols="50">${Directions}</textarea>
              </div>
              <div class="mb-3 d-flex">
                <div class="button-container">
                  <button type="button" class="btn-storage" onclick='edit("${name}")'>Submit</button>
                  <button type="button" class="btn-storage" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>`;

  let myModal = document.getElementById('editModal');
  let myModalModal = new bootstrap.Modal(myModal);
  myModalModal.show();
}

//* Async function to update a recipe with edited details
async function edit(name) {
  let ingredients = document.getElementById("editingredients").value;
  let directions = document.getElementById("editdirections").value;

  if (ingredients == "" || directions == "") {
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

  let editrecipe = {
    Ingredients: ingredients,
    Directions: directions
  };

  let ref = database.ref('/Data/Users/' + uid + '/Recipes/' + name);
  await ref.update(editrecipe);
  updatels();
}

//* Function to open the find modal and display available items for recipes
function openfind() {
  let html = document.getElementById("showfind");
  let show = `<form class="w-50-2 py-5 shadow p-4">`;
  const types = Object.keys(items);
  let counttype = 0;

  types.forEach(typestr => {
    if (typestr != 'none') {
      let type = items[typestr];
      let citems = Object.keys(type);
      let countrew = 0;

      if (citems[0] != "none") {
        show += `<h5>${typestr}</h5><hr><div class="mb-3">`;

        counttype++;
        citems.forEach(itemstr => {
          if (countrew % 3 == 0 && countrew > 2) {
            show += `</div><div class="mb-3">`;
          }

          countrew++;

          if (itemstr != 'none') {
            show += `
              <input type="checkbox" class="form-check-input" id="${itemstr}">
              <label for="Bell paper" class="form-check-label" style="margin-right: 5%;">${itemstr}</label>`;
          }
        });

        show += `</div>`;
      }
      show+=`</form>`;
    }
  });

  html.innerHTML = show;
}

//* Async function to find and display recipes based on selected ingredients
async function findrecipe() {
  document.getElementById("findsub").style.display = "none"
  let html = document.getElementById("showfind");
  document.getElementById("findtitale").innerText = "Choose A Recipe";
  document.getElementById("findform").style.height = "80%";
  let show = ``;
  const types = Object.keys(items);
  let names = [];
  let uri = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=`;

  types.forEach(type => {
    let cnames = Object.keys(items[type]);

    if (cnames[0] != "none") {
      names = names.concat(Object.keys(items[type]));
    }
  });

  names.forEach(name => {
    console.log(document.getElementById(name).checked);

    if (document.getElementById(name).checked) {
      uri += `,+${name}`;
    }
  });

  uri += `&ignorePantry=true&ranking=2&apiKey=cf3e9827356341fd9c77ecfa8f9aa644`;

  await fetch(uri)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      let ingredients = ` `;
      
      data.forEach(recipe => {
        show += `<form class="w-50-2 py-5 shadow p-4"><hr>
          <h5>${recipe.title} <button type="button" class="btn-storage" onclick='addfind(${recipe.id}, \`${ingredients}\`, \`${recipe.title}\`)'>add</button></h5>
          <div class="mb-3"><h6>Missing Ingredients:</h6>`;

        recipe.missedIngredients.forEach(missed => {
          show += `<p>${missed.original}</p>`;
          ingredients += missed.original + `\n`;
        });

        show += `<h6>Used Ingredients:</h6>`;

        recipe.usedIngredients.forEach(used => {
          show += `<p>${used.original}</p>`;
          ingredients += used.original + `\n`;
        });
      });

      html.innerHTML = show;
    });
}

//* Async function to add a recipe found by ingredient to the user's database
async function addfind(id, ing, name) {
  let dire = ``;

  await fetch(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=cf3e9827356341fd9c77ecfa8f9aa644`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(async (data) => {
      let array = data[0].steps;

      array.forEach(step => {
        dire += step.step + `\n`;
      });

      let newrecipe = {
        Ingredients: ing,
        Directions: dire
      };

      let ref = database.ref('/Data/Users/' + uid + '/Recipes/' + name);
      await ref.update(newrecipe);

      if (recipes.none != null) {
        let del = database.ref('/Data/Users/' + uid + '/Recipes/none');
        await del.remove();
      }

      updatels();
    });
}

//* Async function to add a custom recipe to the user's database
async function addrecipe() {
  let name = document.getElementById("new_name").value;
  let ingredients = document.getElementById("new_ingredients").value;
  let directions = document.getElementById("new_directions").value;

  if (name == "" || ingredients == "" || directions == "") {
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

  let newrecipe = {
    Ingredients: ingredients,
    Directions: directions
  };

  let ref = database.ref('/Data/Users/' + uid + '/Recipes/' + name);
  await ref.update(newrecipe);

  if (recipes.none != null) {
    let del = database.ref('/Data/Users/' + uid + '/Recipes/none');
    del.remove();
  }

  updatels();
}

//* Function to display a recipe's details in a modal
function view(name) {
  let html = document.getElementById("viewrecipe");
  let Directions = recipes[name].Directions;
  let Ingredients = recipes[name].Ingredients;

  html.innerHTML = `
    <div class="modal" id="viewModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div>
            <form class="w-50-2 py-5 shadow p-4">
              <h3 class="text-white">${name}</h3><hr>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Ingredients</label>
                <textarea class="form-control" rows="8" cols="50" readonly>${Ingredients}</textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Directions</label>
                <textarea class="form-control" rows="8" cols="50" readonly>${Directions}</textarea>
              </div>
              <div class="mb-3 d-flex">
                <div class="button-container">
                  <button type="button" class="btn-storage" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>`;

  let myModal = document.getElementById('viewModal');
  let myModalModal = new bootstrap.Modal(myModal);
  myModalModal.show();
}

//* Async function to update local storage with the latest user data from the database
async function updatels() {
  const userdataRef = firebase.database().ref('/Data/Users/' + uid);

  await userdataRef.once('value').then(function(snapshot) {
    const userData = snapshot.val();
    localStorage.setItem("userData", JSON.stringify(userData));
  });

  window.location.reload();
}

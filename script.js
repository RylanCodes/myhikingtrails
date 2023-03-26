// The function below will change the background image every time the page loads (thanks Youtube!)
const imgs = [];
imgs[0] = "images/Acropole.png";
imgs[1] = "images/LacauxAmericains.png";
imgs[2] = "images/LaChouenne.png";
imgs[3] = "images/LaGabelle.png";
imgs[4] = "images/MedicineLake.png";
imgs[5] = "images/MontAlbert.png";
imgs[6] = "images/MontTremblant.png";
imgs[7] = "images/MontTremblantVia.png";
imgs[8] = "images/PeytoLake.png";
imgs[9] = "images/Pioui.png";
imgs[10] = "images/Saguenay.png";
imgs[11] = "images/SaguenayGeant.png";
imgs[12] = "images/Xalibut.png";

window.onload = function () {
  const random = Math.floor(Math.random() * imgs.length);
  document.body.style.backgroundImage = `url(${imgs[random]})`;
};

// select all the elements in the HTML page and assign them to a variable
let myTable = document.getElementsByClassName("table-sortable");
let inputId = document.getElementById("id");
let inputName = document.getElementById("name");
let inputKm = document.getElementById("km");
let inputHours = document.getElementById("hours");
let inputDifficultyDegree = document.getElementById(
  "difficulty-degree-dropdown"
);
let inputSymbol = document.getElementsByClassName("symbol");
let inputCheck = document.getElementById("check");
let inputLocation = document.getElementById("location");

// static variables
let trailList = []; // create empty list
let editModeOn = false;
let idtoEdit;
let nextId;
let ascendingOn = true;

checkDataList(); // check if list exists first
nextId = assignNextID(); // autoincrement id after creating list
generateTable(); // populate table

// event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("form-content").onsubmit = addTrail;
  document.getElementById("cancel").onclick = cancelTrail;
  document.getElementById("sortLength").onclick = sortByLength;
  document.getElementById("sortDuration").onclick = sortByDuration;
});

// assign ID automatically
function assignNextID() {
  let tempId = 0;
  trailList.forEach((element) => {
    if (element.id >= tempId) {
      tempId = element.id + 1;
    }
  });
  return tempId;
}

// create object constructor
function Trail(
  id,
  name,
  length,
  duration,
  difficultyDegree,
  winterAccess,
  departurePoint
) {
  this.id = id;
  this.name = name;
  this.length = length;
  this.duration = duration;
  this.difficultyDegree = difficultyDegree;
  this.winterAccess = winterAccess;
  this.departurePoint = departurePoint;

  id = nextId;
  nextId++;
}

// first, check if there is a list
function checkDataList() {
  let list = localStorage.getItem("trails");
  if (list != null) {
    trailList = JSON.parse(list);
  } else {
    trailList = createDefault();
  }
  localStorage.setItem("trails", JSON.stringify(trailList));
}

// save one item/trail at a time
function saveItemLocalStorage(item) {
  let list = JSON.parse(localStorage.getItem("trails"));
  if (list != null) {
    trailList = list;
  } else {
    list = [];
  }
  list.push(item);
  localStorage.setItem("trails", JSON.stringify(trailList));
}

// create default list
function createDefault() {
  // create empty list
  let trails = [];
  // create 5 default objects
  let trail1 = new Trail(
    1,
    "Mont-Albert",
    17.8,
    8,
    "expert",
    false,
    "Parc National de la Gaspésie"
  );
  let trail2 = new Trail(
    2,
    "Le Grand Tour",
    8.7,
    4,
    "intermediate",
    false,
    "Parc National du Bic"
  );
  let trail3 = new Trail(
    3,
    "L'Acropole-des-Draveurs",
    11.2,
    4,
    "intermediate",
    false,
    "Parc National des Hautes-Gorges-de-la-Rivière-Malbaie"
  );
  let trail4 = new Trail(
    4,
    "Le Pioui",
    10.4,
    5,
    "difficult",
    false,
    "Parc National des Grands-Jardins"
  );
  let trail5 = new Trail(
    5,
    "The Crack",
    7.6,
    4,
    "difficult",
    false,
    "Killarney Provincial Park"
  );
  // add objects/trails to the list
  trails.push(trail1);
  trails.push(trail2);
  trails.push(trail3);
  trails.push(trail4);
  trails.push(trail5);
  // return complete list
  return trails;
}

// functions for input form buttons
function cancelTrail(event) {
  // reset form here
  inputName.value = "";
  inputKm.value = "";
  inputHours.value = "";
  inputDifficultyDegree.value = "";
  inputCheck.value = "";
  inputLocation.value = "";
}

function addTrail(event) {
  if (!editModeOn) {
    // get inputs and their values
    let name = inputName.value;
    let km = inputKm.value;
    let hours = inputHours.value;
    let difficulty = inputDifficultyDegree.value;
    let check = inputCheck.checked;
    let location = inputLocation.value;
    let item = new Trail(nextId, name, km, hours, difficulty, check, location);
    // save each new trail added by the user into the list
    saveItemLocalStorage(item);
    // reset form here
    inputName.value = "";
    inputKm.value = "";
    inputHours.value = "";
    inputDifficultyDegree.value = "";
    inputCheck.value = "";
    inputLocation.value = "";
  } else {
    // edit mode on = true
    trailList[idtoEdit].name = inputName.value;
    trailList[idtoEdit].length = inputKm.value;
    trailList[idtoEdit].duration = inputHours.value;
    trailList[idtoEdit].difficultyDegree = inputDifficultyDegree.value;
    trailList[idtoEdit].winterAccess = inputCheck.checked;
    trailList[idtoEdit].departurePoint = inputLocation.value;
    localStorage.setItem("trails", JSON.stringify(trailList));
    editModeOn = false;
  }
}

// create all html table rows here
function addHtmlRow(element) {
  return `
    <tr>
      <td>${element.id}</td>
      <td>${element.name}</td>
      <td>${element.length}</td>
      <td>${element.duration}</td>
      <td>${element.difficultyDegree}</td>
      <td><img class="symbol" src="images/${
        element.difficultyDegree
      }.png" alt="symbol" height="50" width="50"> </td>  
      <td>${element.winterAccess == true ? "Yes" : "No"}</td>
      <td>${element.departurePoint}</td>
      <td>
        <i class="editButton fa-regular fa-pen-to-square"></i>
        <i class="selectButton fa-regular fa-circle-check"></i>
        <i class="deleteButton fa-regular fa-trash-can"></i>
      </td>
    </tr>`;
}

// add all rows to the table
function generateTable() {
  let table = document.getElementById("table-body");
  // delete table content if necessary
  table.innerHTML = "";
  trailList.forEach((element) => {
    // send elements to function above
    table.innerHTML += addHtmlRow(element);
  });
  // manage buttons
  let editButtons = document.getElementsByClassName("editButton");
  let selectButtons = document.getElementsByClassName("selectButton");
  let deleteButtons = document.getElementsByClassName("deleteButton");
  // all buttons have the same length!
  for (let index = 0; index < deleteButtons.length; index++) {
    // call 3 functions below
    editButtons[index].addEventListener("click", editTrail);
    selectButtons[index].addEventListener("click", selectTrail);
    deleteButtons[index].addEventListener("click", deleteTrail);
  }
}

function editTrail(event) {
  editModeOn = true;
  idtoEdit =
    event.target.parentElement.parentElement.getElementsByTagName("td")[0]
      .innerText; // [0] = first td is ID
  for (let index = 0; index < trailList.length; index++) {
    if (trailList[index].id == idtoEdit) {
      // set trail id to the correct index number
      // cause we need the index POSITION to edit the trail
      idtoEdit = index;
      inputName.value = trailList[index].name;
      inputKm.value = trailList[index].length;
      inputHours.value = trailList[index].duration;
      inputDifficultyDegree.value = trailList[index].difficultyDegree;
      inputCheck.value = trailList[index].winterAccess;
      inputLocation.value = trailList[index].departurePoint;
    }
  }
}

function selectTrail(event) {
  let idtoSelect =
    event.target.parentElement.parentElement.getElementsByTagName("td")[0]
      .innerText; // [0] = first td is ID
  for (let index = 0; index < trailList.length; index++) {
    if (trailList[index].id == idtoSelect) {
      event.target.parentElement.parentElement.classList.toggle("row-selected");
    }
  }
  calculateTrails();
}

function deleteTrail(event) {
  let idtoDelete =
    event.target.parentElement.parentElement.getElementsByTagName("td")[0]
      .innerText; // [0] = first td is ID
  for (let index = 0; index < trailList.length; index++) {
    if (trailList[index].id == idtoDelete) {
      trailList.splice(index, 1);
    }
  }
  // grand-parent: parent = td & parent = tr, so we remove tr
  event.target.parentElement.parentElement.remove();
  localStorage.setItem("trails", JSON.stringify(trailList));
}

// calculate length & duration of selected trails
function calculateTrails() {
  let selectedTrails = document.getElementsByClassName("row-selected");
  let totalLentgh = 0.0;
  let totalDuration = 0.0;
  for (let index = 0; index < selectedTrails.length; index++) {
    totalLentgh += Number(
      selectedTrails[index].getElementsByTagName("td")[2].innerText
    );
    totalDuration += Number(
      selectedTrails[index].getElementsByTagName("td")[3].innerText
    );
  }
  document.getElementById(
    "length-duration"
  ).innerText = `Total Length = ${totalLentgh.toFixed(
    0
  )} kms & Duration = ${totalDuration.toFixed(0)} hrs`;
}

// sort by length
function sortByLength(event) {
  trailList.sort((trailA, trailB) => {
    if (ascendingOn) {
      return trailA.length - trailB.length;
    }
    // aka descending
    else {
      return trailB.length - trailA.length;
    }
  });
  ascendingOn = !ascendingOn;
  localStorage.setItem("trails", JSON.stringify(trailList));
  generateTable();
}

// sort by duration
function sortByDuration(event) {
  trailList.sort((trailA, trailB) => {
    if (ascendingOn) {
      return trailA.duration - trailB.duration;
    }
    // aka descending
    else {
      return trailB.duration - trailA.duration;
    }
  });
  ascendingOn = !ascendingOn;
  localStorage.setItem("trails", JSON.stringify(trailList));
  generateTable();
}

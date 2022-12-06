// Citation for this file
// Date: Dec 5, 2022
// Based on/inspired by: NodeJS starter app delete_person.js
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/delete_person.js

function deleteTrain(trainID) {
  let data = {
      train_ID: trainID
  };

  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete_train_ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 204) {
      deleteRow(trainID);
      deleteTrainDropdown(trainID);
    }
    else if (xhttp.readyState == 4 && xhttp.status != 204) {
        console.log("There was an error with the input.")
    }
  }
  xhttp.send(JSON.stringify(data));
}

function deleteRow(trainID){
  let table = document.getElementById("train_table");
  for (let i = 0, row; row = table.rows[i]; i++) {
    if (table.rows[i].getAttribute("data-value") == trainID) {
      table.deleteRow(i);
      break;
    }
  }
}

function deleteTrainDropdown(trainID) {
  let trainDropdown = document.getElementById("updateTrainDropdown");
  for (let i = 0, row; (row = trainDropdown.options[i]); i++) {
    if (trainDropdown.options[i].id == `train${trainID}`) {
      trainDropdown.remove(i);
      break;
    }
  }
}
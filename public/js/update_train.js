// Citation for this file
// Date: Dec 5, 2022
// Based on/inspired by: NodeJS starter app update_person.js
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/update_person.js

let updateTrainForm = document.getElementById('updateTrainForm');
updateTrainForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let train_ID = document.getElementById("updateTrainID");
  let model = document.getElementById("updateTrainModel");
  let last_service_date = document.getElementById("updateTrainServiceDate");
  let line_code = document.getElementById("updateTrainLineCode");

  let trainID = train_ID.value;
  let trainModel = model.value;
  let serviceDate = last_service_date.value;
  let lineID = line_code.value;

  if (isNaN(trainID)) {
    alert("Please fill out all fields and select an train to edit");
    return;
  }

  let data = {
    train_ID: trainID,
    model: trainModel,
    last_service_date: serviceDate,
    line_code: lineID,
  };

  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put_train", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      let train = JSON.parse(xhttp.response);
      updateTrainRow(train);
      updateTrainDropdown(train);
      clearTrainUpdateForm();
      alert("Train successfully updated!");
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };
  xhttp.send(JSON.stringify(data));
});

function updateTrainRow(train) {
  let table = document.getElementById("trainTableBody");
  for (let i = 0, row; (row = table.rows[i]); i++) {
    if (table.rows[i].getAttribute("data-value") == train.train_ID) {
      let updateRowIndex = table.getElementsByTagName("tr")[i];
      updateRowIndex.getElementsByTagName("td")[0].innerHTML = train.train_ID;
      updateRowIndex.getElementsByTagName("td")[1].innerHTML = train.model;
      updateRowIndex.getElementsByTagName("td")[2].innerHTML =
        train.last_service_date_HTMl;
      updateRowIndex.getElementsByTagName("td")[3].innerHTML =
        train.phone_number;
      updateRowIndex.getElementsByTagName("td")[4].innerHTML = train.line_name;
    }
  }
  document.location.reload(true);
}

function updateTrainDropdown() {
  let trainDropdown = document.getElementById("updateTrainDropdown");
  trainDropdown.innerHTML = "";
  let blankOption = new Option();
  trainDropdown.add(blankOption);
  for (const train of trains) {
    let newOption = new Option(
      `${train.train_ID} - ${train.model} (${train.line_name} Line)`,
      `${this.train_ID},${this.model},${this.last_service_date_HTML},${this.line_code}`
    );
    newOption.id = `train${train.train_ID}`;
    trainDropdown.add(newOption);
  }
}

function clearTrainUpdateForm() {
  document.getElementById("updateTrainDropdown").selectedIndex = 0;
  document.getElementById("updateTrainID").value = null;
  document.getElementById("updateTrainModel").value = null;
  document.getElementById("updateTrainServiceDate").value = null;
  document.getElementById("updateTrainLineCode").selectedIndex = null;
}

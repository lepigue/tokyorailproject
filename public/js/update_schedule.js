// Citation for this file
// Date: Dec 5, 2022
// Based on/inspired by: NodeJS starter app update_person.js
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/update_person.js

let updateOperatorForm = document.getElementById("updateScheduleForm");
updateOperatorForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let schedule_ID = document.getElementById("schedule_ID-update");
  let arrival_time = document.getElementById("arrivalTime-update");
  let departure_time = document.getElementById("departureTime-update");
  let station_code = document.getElementById("stationName-update");
  let train_code = document.getElementById("trainId-update");

  let scheduleID = schedule_ID.value;
  let arrivalTime = arrival_time.value;
  let departureTime = departure_time.value;
  let stationCode = station_code.value;
  let trainCode = train_code.value;

  if (
    isNaN(scheduleID) ||
    arrivalTime == "" ||
    departureTime == "" ||
    isNaN(stationCode) ||
    isNaN(trainCode)
  ) {
    alert("Please fill out all form fields");
    return;
  }

  let data = {
    schedule_ID: scheduleID,
    arrival_time: arrivalTime,
    departure_time: departureTime,
    station_code: stationCode,
    train_code: trainCode,
  };

  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put_schedule", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      let res = JSON.parse(xhttp.response);
      updateRow(res, scheduleID);
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };

  xhttp.send(JSON.stringify(data));
});

function updateRow(parsedData, scheduleID) {
  let table = document.getElementById("scheduleTableBody");
  for (let i = 0, row; (row = table.rows[i]); i++) {
    if (table.rows[i].getAttribute("data-value") == scheduleID) {
      let updateRowIndex = table.getElementsByTagName("tr")[i];
      let td = updateRowIndex.getElementsByTagName("td")[3];
      td.innerHTML = parsedData[0].name;
    }
  }
  document.location.reload(true);
}

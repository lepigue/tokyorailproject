// Citation for this file
// Date: Dec 5, 2022
// Based on/Inspired by: NodeJS starter app add_person.js
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/add_person.js

let addScheduleForm = document.getElementById('addScheduleForm-ajax');
addScheduleForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let arrival_time = document.getElementById("arrivalTime-create");
  let departure_time = document.getElementById("departureTime-create");
  let station_code = document.getElementById("stationName-create");
  let train_code = document.getElementById("trainId-create");

  let arrivalTime = arrival_time.value;
  let departureTime = departure_time.value;
  let stationCode = station_code.value;
  let trainCode = train_code.value;

  let data = {
    arrival_time: arrivalTime,
    departure_time: departureTime,
    station_code: stationCode,
    train_code: trainCode,
  };
  if (
    arrivalTime == "" ||
    departureTime == "" ||
    stationCode == "" ||
    trainCode == ""
  ) {
    alert("Please fill out all fields");
    return;
  }
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add_schedule_ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      let res = JSON.parse(xhttp.response);
      addRowToTable(res);
      arrival_time.value = "";
      departure_time.value = "";
      station_code.value = "";
      train_code.value = "";
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };
  xhttp.send(JSON.stringify(data));
});

function addRowToTable(parsedData) {
  let currentTable = document.getElementById("scheduleTableBody");
  let newRow = parsedData[parsedData.length - 1];

  let row = document.createElement("tr");
  let scheduleIDcell = document.createElement("td");
  let arrivalTimeIDcell = document.createElement("td");
  let departureTimeIDcell = document.createElement("td");
  let stationNameIDcell = document.createElement("td");
  let trainCodeIDcell = document.createElement("td");

  scheduleIDcell.innerText = newRow.schedule_ID;
  arrivalTimeIDcell.innerText = newRow.arrival_time;
  departureTimeIDcell.innerText = newRow.departure_time;
  stationNameIDcell.innerText = newRow.station_code;
  trainCodeIDcell.innerText = newRow.train_code;

  row.appendChild(scheduleIDcell);
  row.appendChild(arrivalTimeIDcell);
  row.appendChild(departureTimeIDcell);
  row.appendChild(stationNameIDcell);
  row.appendChild(trainCodeIDcell);
  currentTable.appendChild(row);
  document.location.reload(true);
}

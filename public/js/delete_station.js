// Citation for this file
// Date: Dec 5, 2022
// Based on/inspired by: NodeJS starter app delete_person.js
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/delete_person.js

function deleteStation(stationID) {
  let data = {
    station_ID: stationID,
  };

  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete_station", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 204) {
      deleteRow(stationID);
      deleteStationDropdown(stationID);
      alert("Station successfully deleted!");
    } else if (xhttp.readyState == 4 && xhttp.status != 204) {
      console.log("There was an error with the input.");
    }
  };
  xhttp.send(JSON.stringify(data));
}

function deleteRow(stationID) {
  let table = document.getElementById("station_table");
  for (let i = 0, row; row = table.rows[i]; i++) {
    if (table.rows[i].getAttribute("data-value") == stationID) {
      table.deleteRow(i);
      break;
    }
  }
}

function deleteStationDropdown(stationID) {
  let stationDropdown = document.getElementById("stationUpdateDropdown");
  for (let i = 0, row; (row = stationDropdown.options[i]); i++) {
    if (stationDropdown.options[i].id == `station${stationID}`) {
      stationDropdown.remove(i);
      break;
    }
  }
}
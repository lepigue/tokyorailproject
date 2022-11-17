function deleteStation(stationID) {
  let data = {
    station_ID: stationID,
  };

  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete_station", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
    console.log(xhttp.readyState, xhttp.status);
    if (xhttp.readyState == 4 && xhttp.status == 204) {
      deleteRow(stationID);
    } else if (xhttp.readyState == 4 && xhttp.status != 204) {
      console.log("There was an error with the input.");
    }
  };
  xhttp.send(JSON.stringify(data));
}

function deleteRow(stationID) {
  let table = document.getElementById("station_table");
  console.log(table);
  for (let i = 0, row; row = table.rows[i]; i++) {
    if (table.rows[i].getAttribute("data-value") == stationID) {
      table.deleteRow(i);
      break;
    }
  }
}

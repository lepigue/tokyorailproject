let addStationForm = document.getElementById("addStationForm-ajax");
addStationForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let stationName = document.getElementById("stationName-create").value;
  let lineID = document.getElementById("lineID-stationCreate").value;
  let data = {
    stationName: stationName,
    lineID: lineID,
  };

  if (stationName == "") {
    alert("Please fill out the Station Name field");
    return;
  }

  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add_station_ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      const res = JSON.parse(xhttp.response);
      let parsedStation = res.station;
      let parsedStations = res.stations;
      addStationRow(parsedStation);
      addStationDropdown(parsedStations);
      clearAddStationForm();
      alert("Station successfully added!");
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };
  xhttp.send(JSON.stringify(data));
});

function addStationRow(station) {
  let currentTable = document.getElementById("stationTableBody");
  let row = document.createElement("tr");
  let stationIDCell = document.createElement("td");
  let stationNameCell = document.createElement("td");
  let stationNumCell = document.createElement("td");
  let lineNameCell = document.createElement("td");
  let deleteButtonCell = document.createElement("td");

  stationIDCell.innerText = station.stationID;
  stationNameCell.innerText = station.stationName;
  stationNumCell.innerText = station.stationNum;
  lineNameCell.innerText = station.lineName;
  deleteButtonCell.innerHTML = `<button onclick="deleteStation(${station.stationID})">Delete</button>`;
  
  row.appendChild(stationIDCell);
  row.appendChild(stationNameCell);
  row.appendChild(stationNumCell);
  row.appendChild(lineNameCell);
  row.appendChild(deleteButtonCell);
  row.setAttribute("data-value", station.stationID);
  row.setAttribute("data-name", station.stationName);

  row.id = `station${station.stationID}`;
  currentTable.appendChild(row);
}

function addStationDropdown(stations) {
  let stationDropdown = document.getElementById("stationUpdateDropdown");
  stationDropdown.innerHTML = "";
  let blankOption = new Option();
  stationDropdown.add(blankOption);
  for (const station of stations) {
    let newOption = new Option(
      `${station.location_name} Station (${station.line_name} Line)`,
      `${station.station_ID},${station.location_name},${station.station_num},${station.line_name},${station.line_code},${station.row_num}`
    );
    stationDropdown.add(newOption);
  }
}

function clearAddStationForm() {
  document.getElementById("stationName-create").value = null;
  document.getElementById("lineID-stationCreate").selectedIndex = 0;
}
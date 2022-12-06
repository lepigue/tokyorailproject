let updateOperatorForm = document.getElementById("updateStationForm");
updateOperatorForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let stationID = document.getElementById("updateStationID").value;
  let stationName = document.getElementById("updateStationName").value;
  let stationNum = document.getElementById("updateStationNum").value;
  let lineIdElem = document.getElementById("updateLineIDName");
  let lineData = lineIdElem.options[lineIdElem.selectedIndex].value.split(",");
  let lineID = lineData[0];
  let lineName = lineData[1];

  if (isNaN(stationID)) {
    return;
  }

  let station = {
    stationID: stationID,
    stationName: stationName,
    stationNum: stationNum,
    lineName: lineName,
    lineID: lineID,
  };
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put_station", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      const res = JSON.parse(xhttp.response);
      updateStationRow(res.newStation);
      updateStationDropdown(res.stations);
      clearUpdateStationForm();
      alert("Station successfully updated!");
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };
  xhttp.send(JSON.stringify(station));
});

function updateStationRow(station) {
  let table = document.getElementById("stationTableBody");
  document.getElementById("updateLineIDName").value = station.line_name;

  for (let i = 0, row; (row = table.rows[i]); i++) {  
    if (table.rows[i].getAttribute("data-value") == `${station.station_ID}`) {
      let updateRowIndex = table.getElementsByTagName("tr")[i];
      updateRowIndex.getElementsByTagName("td")[0].innerHTML =
        station.station_ID;
      updateRowIndex.getElementsByTagName("td")[1].innerHTML =
        station.location_name;
      updateRowIndex.getElementsByTagName("td")[2].innerHTML =
        station.station_num;
      updateRowIndex.getElementsByTagName("td")[3].innerHTML = station.line_name;
    }
  }
}

function updateStationDropdown(stations) {
  let stationDropdown = document.getElementById("stationUpdateDropdown");
  stationDropdown.innerHTML = "";
  let blankOption = new Option();
  stationDropdown.add(blankOption);
  for (const station of stations) {
    let newOption = new Option(
      `${station.location_name} Station (${station.line_name} Line)`,
      `${station.station_ID},${station.location_name},${station.station_num},${station.line_name},${station.line_code},${station.row_num}`
    );
    newOption.id = `station${station.station_ID}`;
    stationDropdown.add(newOption);
  }
}

function clearUpdateStationForm() {
  document.getElementById("stationUpdateDropdown").selectedIndex = 0;
  document.getElementById("updateStationID").value = null;
  document.getElementById("updateStationName").value = null;
  document.getElementById("updateStationNum").value = null;
  document.getElementById("updateLineIDName").selectedIndex = 0;
}
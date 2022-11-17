// Get the objects we need to modify
let updateOperatorForm = document.getElementById("updateStationForm");

// Modify the objects we need
updateOperatorForm.addEventListener("submit", function (e) {
  // Prevent the form from submitting
  e.preventDefault();

  // Get form fields we need to get data from
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

  // Put our data we want to send in a javascript object
  let data = {
    stationID: stationID,
    stationName: stationName,
    stationNum: stationNum,
    lineID: lineID,
  };
  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put_station", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Add the new data to the table
      updateRow(xhttp.response, stationID);
      updateDropdown(stationID, stationName, stationNum, lineName, lineID);
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});

function updateRow(data, stationID) {
  let parsedData = JSON.parse(data);
  let table = document.getElementById("station_table");
  document.getElementById("updateLineIDName").value = parsedData[0].line_name;

  for (let i = 0, row; (row = table.rows[i]); i++) {
    //iterate through rows
    //rows would be accessed using the "row" variable assigned in the for loop
    if (table.rows[i].getAttribute("data-value") == stationID) {
      // Get the location of the row where we found the matching person ID
      let updateRowIndex = table.getElementsByTagName("tr")[i];

      // Get td of homeworld value
      updateRowIndex.getElementsByTagName("td")[0].innerHTML = parsedData[0].station_ID;
      updateRowIndex.getElementsByTagName("td")[1].innerHTML = parsedData[0].location_name;
      updateRowIndex.getElementsByTagName("td")[2].innerHTML = parsedData[0].station_num;
      updateRowIndex.getElementsByTagName("td")[3].innerHTML = parsedData[0].line_name;
    }
  }
}

function updateDropdown(stationID, stationName, stationNum, lineName, lineID) {
  // update station dropdown to show new line
  let stationDropdown = document.getElementById("stationUpdateDropdown")
  stationDropdown.options[
    stationDropdown.selectedIndex
  ].text = `${stationName} Station (${lineName} Line)`;
  stationDropdown.options[
    stationDropdown.selectedIndex
  ].value = `${stationID},${stationName},${stationNum},${lineName},${lineID}`;

  // populate Current Line dropdown with current line
  let linesDropdown = document.getElementById("updateLineIDName");
  linesDropdown.selectedIndex = lineID;

}
// Get the objects we need to modify
let updateOperatorForm = document.getElementById("updateStationForm");

// Modify the objects we need
updateOperatorForm.addEventListener("submit", function (e) {
  // Prevent the form from submitting
  e.preventDefault();
  console.log("MADE IT");

  // Get form fields we need to get data from
  let stationID = document.getElementById("stationID").value;
  let stationName = document.getElementById("updateStationName").value;
  let stationNum = document.getElementById("updatestationNum").value;
  let lineID = document.getElementById("updateLineID").value;

  if (isNaN(stationID)) {
    return;
  }

  // Put our data we want to send in a javascript object
  let data = {
    operator_ID: stationID,
    stationName: stationName,
    stationNum: stationNum,
    lineID: lineID,
  };
  console.log(data)

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put_station", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Add the new data to the table
      updateRow(xhttp.response, stationID);
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});

function updateRow(data, personID) {
  let parsedData = JSON.parse(data);

  let table = document.getElementById("operator_table");

  for (let i = 0, row; (row = table.rows[i]); i++) {
    //iterate through rows
    //rows would be accessed using the "row" variable assigned in the for loop
    if (table.rows[i].getAttribute("data-value") == personID) {
      // Get the location of the row where we found the matching person ID
      let updateRowIndex = table.getElementsByTagName("tr")[i];

      // Get td of homeworld value
      let td = updateRowIndex.getElementsByTagName("td")[3];

      // Reassign homeworld to our value we updated to
      td.innerHTML = parsedData[0].name;
    }
  }
}

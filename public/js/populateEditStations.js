// Get the objects we need to modify

function populateForm() {
  document.getElementById("updateStationForm");
  let stationData = document.getElementById("stationUpdateDropdown").value;
  let dataArray = stationData.split(",");
  let stationID = dataArray[0];
  let stationName = dataArray[1];
  let stationNum = dataArray[2];
  let lineName = dataArray[3];

  document.getElementById("updateStationID").value = stationID;
  document.getElementById("updateStationName").value = stationName;
  document.getElementById("updateStationNum").value = stationNum;
  document.getElementById("updateLineName").value = lineName;
}

document.getElementById("stationUpdateDropdown").addEventListener("change", populateForm);

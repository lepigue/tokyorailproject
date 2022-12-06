function populateStation() {
  let stationData = document.getElementById("stationUpdateDropdown").value;
  let dataArray = stationData.split(",");
  let stationID = dataArray[0];
  let stationName = dataArray[1];
  let stationNum = dataArray[2];
  let lineName = dataArray[3];
  let lineID = dataArray[4];
  let lineRowNumber = dataArray[5];

  if (stationID) {
    document.getElementById("updateStationID").value = stationID;
    document.getElementById("updateStationName").value = stationName;
    document.getElementById("updateStationNum").value = stationNum;
  } else {
    document.getElementById("updateStationID").value = null;
    document.getElementById("updateStationName").value = null;
    document.getElementById("updateStationNum").value = null;
  }
  document.getElementById("updateLineIDName").selectedIndex = lineRowNumber;
}

document
  .getElementById("stationUpdateDropdown")
  .addEventListener("change", populateStation);

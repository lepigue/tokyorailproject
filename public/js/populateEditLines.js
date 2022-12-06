// Get the objects we need to modify

function populateForm() {
  document.getElementById("updateLineForm");
  let stationData = document.getElementById("lineUpdateDropdown").value;
  let dataArray = stationData.split(",");
  let lineID = dataArray[0];
  let lineName = dataArray[1];

  document.getElementById("updateLineID").value = lineID;
  document.getElementById("updateLineName").value = lineName;
  let linesDropdown = document.getElementById("updateLineIDName");
  linesDropdown.options[linesDropdown.selectedIndex] = lineID;
}

document.getElementById("lineUpdateDropdown").addEventListener("change", populateForm);

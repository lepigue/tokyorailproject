function populateForm() {
  document.getElementById("updateLineForm");
  let stationData = document.getElementById("lineUpdateDropdown").value;

  if (stationData) {
    let dataArray = stationData.split(",");
    let lineID = dataArray[0];
    let lineName = dataArray[1];

    document.getElementById("updateLineID").value = lineID;
    document.getElementById("updateLineName").value = lineName;
    let linesDropdown = document.getElementById("lineUpdateDropdown");
    linesDropdown.options[linesDropdown.selectedIndex] = lineID;
  } else {
    document.getElementById("updateLineID").value = null;
    document.getElementById("updateLineName").value = null;
    let linesDropdown = document.getElementById("lineUpdateDropdown");
    linesDropdown.options[linesDropdown.selectedIndex] = 0;
  }
}

document.getElementById("lineUpdateDropdown").addEventListener("change", populateForm);

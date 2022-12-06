function populateForm() {
  document.getElementById("updateTrainForm");
  let trainData = document.getElementById("updateTrainDropdown").value;
  let dataArray = trainData.split(",");
  let trainID = dataArray[0];
  let trainModel = dataArray[1];
  let trainDateHTML = dataArray[2];
  let trainLineCode = dataArray[3];

  if (trainID) {
    document.getElementById("updateTrainID").value = trainID;
    document.getElementById("updateTrainModel").value = trainModel;
    document.getElementById("updateTrainServiceDate").value = trainDateHTML;
  } else {
    document.getElementById("updateTrainID").value = null;
    document.getElementById("updateTrainModel").value = null;
    document.getElementById("updateTrainServiceDate").value = null;
  }
  let linesDropdown = document.getElementById("updateTrainLineCode");
  linesDropdown.selectedIndex = trainLineCode;
}

document
  .getElementById("updateTrainDropdown")
  .addEventListener("change", populateForm);

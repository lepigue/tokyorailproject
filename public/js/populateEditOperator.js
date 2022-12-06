function populateOperator() {
  let operatorData = document.getElementById("operatorUpdateDropdown").value;
  let dataArray = operatorData.split(",");
  let operatorID = dataArray[0];
  let operatorFirstName = dataArray[1];
  let operatorLastName = dataArray[2];
  let operatorPhone = dataArray[3];
  let operatorEmail = dataArray[4];
  let operatorTrainCode = dataArray[5];

  document.getElementById("updateOperatorID").value = operatorID;
  document.getElementById("update-firstName").value = operatorFirstName;
  document.getElementById("update-lastName").value = operatorLastName;
  document.getElementById("update-phoneNumber").value = operatorPhone;
  document.getElementById("update-email").value = operatorEmail;
  document.getElementById("trainCode-edit").selectedIndex = operatorTrainCode;
}

document
  .getElementById("operatorUpdateDropdown")
  .addEventListener("change", populateOperator);

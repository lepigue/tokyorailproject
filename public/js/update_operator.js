// Citation for this file
// Date: Dec 5, 2022
// Based on/inspired by: NodeJS starter app update_person.js
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/update_person.js

let updateOperatorForm = document.getElementById('updateOpForm');
updateOperatorForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let operator_ID = document.getElementById("updateOperatorID");
  let first_name = document.getElementById("update-firstName");
  let last_name = document.getElementById("update-lastName");
  let phone_number = document.getElementById("update-phoneNumber");
  let email = document.getElementById("update-email");
  let train_code = document.getElementById("trainCode-edit");

  let opIDValue = operator_ID.value;
  let firstNameValue = first_name.value;
  let lastNameValue = last_name.value;
  let phoneNumberValue = phone_number.value;
  let emailValue = email.value;
  let trainCodeEdit = train_code.value;

  if (
    isNaN(opIDValue) ||
    firstNameValue == "" ||
    lastNameValue == "" ||
    isNaN(trainCodeEdit)
  ) {
    alert("All fields required except phone number or email");
    return;
  }

  let data = {
    operator_ID: opIDValue,
    first_name: firstNameValue,
    last_name: lastNameValue,
    phone_number: phoneNumberValue,
    email: emailValue,
    train_code: trainCodeEdit,
  };
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put_operator", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      let res = JSON.parse(xhttp.response);
      updateOperatorRow(res.operator);
      updateOperatorDropdown(res.operators);
      clearOperatorStationForm();
      alert("Operator successfully updated!");
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };
  xhttp.send(JSON.stringify(data));
});

function updateOperatorRow(operator) {
  let table = document.getElementById("operatorTableBody");
  for (let i = 0, row; (row = table.rows[i]); i++) {
    if (
      table.rows[i].getAttribute("id") == `operatorRow${operator.operator_ID}`
    ) {
      let updateRowIndex = table.getElementsByTagName("tr")[i];
      updateRowIndex.getElementsByTagName("td")[0].innerHTML =
        operator.operator_ID;
      updateRowIndex.getElementsByTagName("td")[1].innerHTML =
        operator.first_name;
      updateRowIndex.getElementsByTagName("td")[2].innerHTML =
        operator.last_name;
      updateRowIndex.getElementsByTagName("td")[3].innerHTML =
        operator.phone_number;
      updateRowIndex.getElementsByTagName("td")[4].innerHTML = operator.email;
      updateRowIndex.getElementsByTagName("td")[5].innerHTML =
        operator.train_name;
    }
  }
}

function updateOperatorDropdown(operators) {
  let operatorDropdown = document.getElementById("operatorUpdateDropdown");
  operatorDropdown.innerHTML = "";
  let blankOption = new Option();
  operatorDropdown.add(blankOption);
  for (const operator of operators) {
    let newOption = new Option(
      `${operator.first_name} ${operator.last_name}`,
      `${operator.operator_ID},${operator.first_name},${operator.last_name},${operator.phone_number},${operator.email},${operator.train_name},${operator.train_code}`
    );
    newOption.id = `operator${operator.operator_ID}`;
    operatorDropdown.add(newOption);
  }
}

function clearOperatorStationForm() {
  document.getElementById("operatorUpdateDropdown").selectedIndex = 0;
  document.getElementById("updateOperatorID").value = null;
  document.getElementById("update-firstName").value = null;
  document.getElementById("update-lastName").value = null;
  document.getElementById("update-phoneNumber").value = null;
  document.getElementById("update-email").value = null;
  document.getElementById("trainCode-edit").selectedIndex = 0;
}

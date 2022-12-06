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

  if (isNaN(opIDValue)) {
      alert("Please fill out all fields and select an operator to edit")
      return;
  }

  let data = {
      operator_ID: opIDValue,
      first_name: firstNameValue,
      last_name: lastNameValue,
      phone_number: phoneNumberValue,
      email: emailValue,
      train_code: trainCodeEdit
  }
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put_operator", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      let res = JSON.parse(xhttp.response);
      updateOperatorRow(res.operator);
      updateOperatorDropdown(res.operators);
      clearOperatorStationForm();
    }
    else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.")
    }
  }
  xhttp.send(JSON.stringify(data));
})

function updateOperatorRow(operator){
  let table = document.getElementById("operatorTableBody");
  for (let i = 0, row; (row = table.rows[i]); i++) {
    if (table.rows[i].getAttribute("id") == `operatorRow${operator.operator_ID}`) {
      let updateRowIndex = table.getElementsByTagName("tr")[i];
      updateRowIndex.getElementsByTagName("td")[0].innerHTML =
        operator.operator_ID;
      updateRowIndex.getElementsByTagName("td")[1].innerHTML =
        operator.first_name;
      updateRowIndex.getElementsByTagName("td")[2].innerHTML =
        operator.last_name;
      updateRowIndex.getElementsByTagName("td")[3].innerHTML =
        operator.phone_number;
      updateRowIndex.getElementsByTagName("td")[4].innerHTML =
        operator.email;
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
      `${operator.operator_ID},${operator.first_name},${operator.last_name},${operator.phone_number},${operator.email},${operator.train_name}`
    );
    newOption.id = `operatorRow${operator.operatorID}`;
    operatorDropdown.add(newOption);
  }
}

function clearOperatorStationForm() {
  document.getElementById("updateOperatorID").selectedIndex = 0;
  document.getElementById("update-firstName").value = null;
  document.getElementById("update-lastName").value = null;
  document.getElementById("update-phoneNumber").value = null;
  document.getElementById("update-email").value = null;
  document.getElementById("trainCode-edit").selectedIndex = 0;
}

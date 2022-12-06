// Citation for this file
// Date: Dec 5, 2022
// Based on: NodeJS starter app
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

let addOperatorForm = document.getElementById('addOperatorForm-ajax');
addOperatorForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let firstName = document.getElementById("addOperatorFName").value;
    let lastName = document.getElementById("addOperatorLName").value;
    let phoneNum = document.getElementById("addOperatorPhone").value;
    let email = document.getElementById("addOperatorEmail").value;
    let trainCode = document.getElementById("addOperatorTrain").value;

    let data = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNum,
      email: email,
      train_code: trainCode,
    };
    if (firstName == "" || lastName == "" || trainCode == "") {
        alert("Please fill out the all fields. Only email can be left blank")
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_operator_ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let res = JSON.parse(xhttp.response);
            addRowToTable(res.operator);
            addOperatorDropdown(res.operators);
            clearAddOperatorForm();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));
})

function addRowToTable (operator) {
  let currentTable = document.getElementById("operatorTableBody");
  let row = document.createElement("tr");
  let operatorIDCell = document.createElement("td");
  let firstNameCell = document.createElement("td");
  let lastNameCell = document.createElement("td");
  let phoneNumCell = document.createElement("td");
  let emailCell = document.createElement("td");
  let trainNameCell = document.createElement("td");
  let deleteButtonCell = document.createElement("td");

  operatorIDCell.innerText = operator.operator_ID;
  firstNameCell.innerText = operator.first_name;
  lastNameCell.innerText = operator.last_name;
  phoneNumCell.innerText = operator.phone_number;
  emailCell.innerText = operator.email;
  trainNameCell.innerText = operator.train_name;
  deleteButtonCell.innerHTML = `<button onclick="deleteOperator(${operator.operator_ID})">Delete</button>`;

  row.appendChild(operatorIDCell);
  row.appendChild(firstNameCell);
  row.appendChild(lastNameCell);
  row.appendChild(phoneNumCell);
  row.appendChild(emailCell);
  row.appendChild(trainNameCell);
  row.appendChild(deleteButtonCell);
  row.setAttribute("data-value", operator.operator_ID);
  row.id = `operatorRow${operator.operator_ID}`;
  currentTable.appendChild(row);
};

function addOperatorDropdown(operators) {
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

function clearAddOperatorForm() {
  document.getElementById("addOperatorFName").value = null;
  document.getElementById("addOperatorLName").value = null;
  document.getElementById("addOperatorPhone").value = null;
  document.getElementById("addOperatorEmail").value = null;
  document.getElementById("addOperatorTrain").selectedIndex = 0;
}
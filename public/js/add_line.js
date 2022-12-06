// Citation for this file
// Date: Dec 5, 2022
// Based on/inspired by: NodeJS starter app add_person.js
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/add_person.js

let addLineForm = document.getElementById('addLineForm-ajax');

addLineForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let line_name = document.getElementById("lineName-create");
  let lineName = line_name.value;
  let data = {
    line_name: lineName,
  };
  if (lineName == "") {
    alert("Please fill out the Line Name field");
    return;
  }
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add_line_ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      let lines = JSON.parse(xhttp.response);
      addRowToTable(lines);
      addLineDropdown(lines);
      clearAddLineForm();
      line_name.value = "";
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };
  xhttp.send(JSON.stringify(data));
});

function addRowToTable(lines) {
  let currentTable = document.getElementById("lineTableBody");
  let newRow = lines[lines.length - 1];
  let row = document.createElement("tr");
  let lineIDCell = document.createElement("td");
  let lineNameCell = document.createElement("td");
  let deleteButtonCell = document.createElement("td");

  lineIDCell.innerText = newRow.line_ID;
  lineNameCell.innerText = newRow.line_name;
  deleteButtonCell.innerHTML = `<button onclick="deleteLine(${newRow.line_ID})">Delete</button>`;
  row.appendChild(lineIDCell);
  row.appendChild(lineNameCell);
  row.appendChild(deleteButtonCell);
  row.setAttribute("data-value", newRow.line_ID);
  row.setAttribute("id", `deleteLine${newRow.line_ID}`);
  currentTable.appendChild(row);
}

function addLineDropdown(lines) {
  let lineDropdown = document.getElementById("lineUpdateDropdown");
  lineDropdown.innerHTML = "";
  let blankOption = new Option();
  lineDropdown.add(blankOption);
  for (const line of lines) {
    let newOption = new Option(
      `${line.line_name}`,
      `${line.line_ID},${line.line_name}`
    );
    newOption.id = `line${line.line_ID}`;
    lineDropdown.add(newOption);
  }
}

function clearAddLineForm() {
  document.getElementById("updateLineID").value = null;
  document.getElementById("updateLineName").value = null;
  document.getElementById("lineUpdateDropdown").selectedIndex = 0;
}

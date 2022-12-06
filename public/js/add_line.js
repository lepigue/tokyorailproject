// Get the objects we need to modify
let addLineForm = document.getElementById('addLineForm-ajax');

addLineForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let line_name = document.getElementById("lineName-create");
  let lineName = line_name.value;
  let data = {
    line_name: lineName,
  }

  if (lineName == "") 
  {
    alert("Please fill out the Line Name field")
    return;
  }

  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add_line_ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        addRowToTable(xhttp.response);
        line_name.value = '';
      }
      else if (xhttp.readyState == 4 && xhttp.status != 200) {
          console.log("There was an error with the input.")
      }
  }
  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));

})

// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (res) => {
    let currentTable = document.getElementById("lineTableBody");
    let lines = JSON.parse(res);
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
    row.setAttribute("data-value", newRow.line_ID)
    currentTable.appendChild(row);
}

function updateDropdown(lineID, lineName) {
  // update line dropdown to show new line
  let lineDropdown = document.getElementById("lineUpdateDropdown");
  lineDropdown.options[lineDropdown.selectedIndex].text = `${lineName}`;
  lineDropdown.options[lineDropdown.selectedIndex].value = `${lineID}`;

  // populate current line dropdown with new line name
  let linesDropdown = document.getElementById("updateLineName");
  linesDropdown.selectedIndex = lineID;
}
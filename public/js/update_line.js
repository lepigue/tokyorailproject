let updateLineForm = document.getElementById('updateLineForm');
updateLineForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let lineID = parseInt(document.getElementById("updateLineID").value);
  let lineName = document.getElementById("updateLineName").value;

  if (isNaN(lineID) || lineName == "") {
    alert("Please fill out all fields and select a line to edit")
    return;
  }
  let data = {
    line_ID: lineID,
    line_name: lineName,
  }
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put_line", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      let parsedLine = JSON.parse(xhttp.response)[0];
      updateLineRow(parsedLine);
      updateLineDropdown(parsedLine);
      clearUpdateLineForm();
      alert("Line successfully updated!")
    }
    else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.")
    }
  }
  xhttp.send(JSON.stringify(data));
})


function updateLineRow(line) {
  let table = document.getElementById("line_table");
  for (let i = 0, row; (row = table.rows[i]); i++) {
    if (table.rows[i].id == `deleteLine${line.line_ID}`) {
      let updateRowIndex = table.getElementsByTagName("tr")[i];
      updateRowIndex.getElementsByTagName("td")[0].innerHTML = line.line_ID;
      updateRowIndex.getElementsByTagName("td")[1].innerHTML = line.line_name;
    }
  }
}

function updateLineDropdown(line) {
  let lineDropdown = document.getElementById("lineUpdateDropdown");
  lineDropdown.options[lineDropdown.selectedIndex].value = `${line.line_ID},${line.line_name}`;
  lineDropdown.options[
    lineDropdown.selectedIndex
  ].text = `${line.line_name}`;
}

function clearUpdateLineForm() {
  document.getElementById("lineUpdateDropdown").selectedIndex = 0;
  document.getElementById("updateLineID").value = null;
  document.getElementById("updateLineName").value = null;
}
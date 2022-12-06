function deleteLine(lineID) {
  let data = {
      line_ID: lineID
  };

  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete_line_ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 204) {
      deleteRow(lineID);
      deleteLineDropdown(lineID);
    }
    else if (xhttp.readyState == 4 && xhttp.status != 204) {
      console.log("There was an error with the input.")
    }
  }
    xhttp.send(JSON.stringify(data));
}


function deleteRow(lineID){
  let table = document.getElementById("lineTableBody");
  for (let i = 0, row; row = table.rows[i]; i++) {
    if (table.rows[i].id == `deleteLine${lineID}`) {
      table.deleteRow(i);
      break;
    }
  }
}

function deleteLineDropdown(lineID) {
  let lineDropdown = document.getElementById("lineUpdateDropdown");
  for (let i = 0, row; (row = lineDropdown.options[i]); i++) {
    if (lineDropdown.options[i].id == `line${lineID}`) {
      lineDropdown.remove(i);
      break;
    }
  }
}
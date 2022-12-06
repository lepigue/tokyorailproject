function deleteOperator(operatorID) {
  operatorID = parseInt(operatorID);
  let data = {
    operator_ID: operatorID,
  };
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete_operator", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 204) {
      deleteRow(operatorID);
      deleteOperatorDropdown(operatorID);
    } else if (xhttp.readyState == 4 && xhttp.status != 204) {
      console.log("There was an error with the input.");
    }
  };
  xhttp.send(JSON.stringify(data));
}

function deleteRow(operatorID) {
  let table = document.getElementById("operator_table");
  for (let i = 0, row; (row = table.rows[i]); i++) {
    if (table.rows[i].id == `operatorRow${operatorID}`) {
      table.deleteRow(i);
      break;
    }
  }
}

function deleteOperatorDropdown(operatorID) {
  let operatorDropdown = document.getElementById("operatorUpdateDropdown");
  for (let i = 0, row; (row = operatorDropdown.options[i]); i++) {
    console.log(operatorDropdown.options[i].id);
    if (operatorDropdown.options[i].id == `operator${operatorID}`) {
      operatorDropdown.remove(i);
      break;
    }
  }
}

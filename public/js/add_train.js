let addTrainForm = document.getElementById('addTrainForm-ajax');
addTrainForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let train_model = document.getElementById("trainModel");
    let service_date = document.getElementById("serviceDate");
    let train_line = document.getElementById("line_code");

    let trainModel = train_model.value;
    let serviceDate = service_date.value;
    let trainLine = train_line.value;

    let data = {
        model: trainModel,
        last_service_date: serviceDate,
        line_code: trainLine
    }
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_train_ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          let parsedData = JSON.parse(xhttp.response);
            addRowToTable(parsedData);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));
})

function addRowToTable (train) => {
  let currentTable = document.getElementById("trainTableBody");
  let newRowIndex = currentTable.rows.length;
  let parsedData = JSON.parse(data);
  let newRow = parsedData[parsedData.length - 1]
  let row = document.createElement("TR");
  let idCell = document.createElement("TD");
  let modelCell = document.createElement("TD");
  let serviceDateCell = document.createElement("TD");
  let trainLineCell = document.createElement("TD");

  idCell.innerText = newRow.train_ID;
  modelCell.innerText = newRow.model;
  serviceDateCell.innerText = newRow.last_service_date;
  trainLineCell.innerText = newRow.line_code;

  row.appendChild(idCell);
  row.appendChild(modelCell);
  row.appendChild(serviceDateCell);
  row.appendChild(trainLineCell);
  row.setAttribute("data-value", train.trainID);
  
  row.id = `train${train.trainID}`;
  currentTable.appendChild(row);
}
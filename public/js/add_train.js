let addTrainForm = document.getElementById('addTrainForm-ajax');
addTrainForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let train_model = document.getElementById("addTrainModel");
    let service_date = document.getElementById("addTrainServiceDate");
    let train_line = document.getElementById("addTrainLineCode");

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
          addRowToTable(parsedData.train);
          addTrainDropdown(parsedData.train);
          clearAddTrainForm();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));
})

function addRowToTable (train) {
  let currentTable = document.getElementById("trainTableBody");
  let row = document.createElement("tr");
  let idCell = document.createElement("td");
  let modelCell = document.createElement("td");
  let serviceDateCell = document.createElement("td");
  let trainLineCell = document.createElement("td");
  let trainDeleteButton = document.createElement("td");

  idCell.innerText = train.train_ID;
  modelCell.innerText = train.model;
  serviceDateCell.innerText = train.last_service_date_HTML;
  trainLineCell.innerText = train.line_name;
  trainDeleteButton.innerHTML = `<button onclick="deleteTrain(${train.train_ID})">Delete</button>`;


  row.appendChild(idCell);
  row.appendChild(modelCell);
  row.appendChild(serviceDateCell);
  row.appendChild(trainLineCell);
  row.appendChild(trainDeleteButton);
  row.setAttribute("data-value", train.train_ID);
  
  row.id = `deleteTrain${train.train_ID}`;
  currentTable.appendChild(row);
}

function addTrainDropdown(train) {
  let trainDropdown = document.getElementById("updateTrainDropdown");
  let newOption = new Option(
    `${train.train_ID} - ${train.model} (${train.line_name} Line)`,
    `${train.train_ID},${train.model},${train.last_service_date_HTML},${train.line_code}`
  );
  newOption.id = `train${train.train_ID}`;
  trainDropdown.add(newOption);
  console.log(newOption);
}

function clearAddTrainForm() {
  document.getElementById("addTrainModel").value = null;
  document.getElementById("addTrainServiceDate").value = null;
  document.getElementById("addTrainLineCode").value = null;
}
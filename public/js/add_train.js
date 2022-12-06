// Get the objects we need to modify
let addTrainForm = document.getElementById('addTrainForm-ajax');

// Modify the objects we need
addTrainForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let train_model = document.getElementById("trainModel");
    let service_date = document.getElementById("serviceDate");
    let train_line = document.getElementById("line_code");

    // Get the values from the form fields
    let trainModel = train_model.value;
    let serviceDate = service_date.value;
    let trainLine = train_line.value;

    // Put our data we want to send in a javascript object
    let data = {
        model: trainModel,
        last_service_date: serviceDate,
        line_code: trainLine
    }
     //console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_train_ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            train_model.value = '';
            service_date.value = '';
            train_line.value = '';
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
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("train_table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let modelCell = document.createElement("TD");
    let serviceDateCell = document.createElement("TD");
    let trainLineCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.train_ID;
    modelCell.innerText = newRow.model;
    serviceDateCell.innerText = newRow.last_service_date;
    trainLineCell.innerText = newRow.line_code;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(modelCell);
    row.appendChild(serviceDateCell);
    row.appendChild(trainLineCell);
    
    // Add the row to the table
    currentTable.appendChild(row);

    document.location.reload(true); 
}
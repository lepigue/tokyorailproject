// Get the objects we need to modify
let addLineForm = document.getElementById('addLineForm-ajax');

// Modify the objects we need
addLineForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let line_name = document.getElementById("lineName-create");

    // Get the values from the form fields
    let lineName = line_name.value;

    // Put our data we want to send in a javascript object
    let data = {
        line_name: lineName,
    }

    if (lineName == "") 
    {
        alert("Please fill out the Line Name field")
        return;
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_line_ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
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
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("line_table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let lineIDCell = document.createElement("TD");
    let lineNameCell = document.createElement("TD");

    // Fill the cells with correct data
    lineIDCell.innerText = newRow.line_ID;
    lineNameCell.innerText = newRow.line_name; 

    // Add the cells to the row 
    row.appendChild(lineIDCell);
    row.appendChild(lineNameCell);

    
    // Add the row to the table
    currentTable.appendChild(row);

    document.location.reload(true); 
}
// Get the objects we need to modify
let addLineForm = document.getElementById('addLineForm-ajax');

// Modify the objects we need
addLineForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let line_name = document.getElementById("lineName-create");
    let start_station = document.getElementById("startStation-create");
    let end_station = document.getElementById("endStation-create");

    // Get the values from the form fields
    let lineName = line_name.value;
    let startStation = start_station.value;
    let endStation = end_station.value;

    // Put our data we want to send in a javascript object
    let data = {
        line_name: lineName,
        start_station: startStation,
        end_station: endStation
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
            start_station.value = '';
            end_station.value = '';
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
    let startCell = document.createElement("TD");
    let endCell = document.createElement("TD");

    // Fill the cells with correct data
    lineIDCell.innerText = newRow.line_ID;
    lineNameCell.innerText = newRow.line_name; //Different Variable?
    startCell.innerText = newRow.start_station;
    endCell.innerText = newRow.end_Station;

    // Add the cells to the row 
    row.appendChild(lineIDCell);
    row.appendChild(lineNameCell);
    row.appendChild(startCell);
    row.appendChild(endCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
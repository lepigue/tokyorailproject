// Get the objects we need to modify
let addScheduleForm = document.getElementById('addScheduleForm-ajax');

// Modify the objects we need
addScheduleForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let arrival_time = document.getElementById("arrivalTime-create");
    let departure_time = document.getElementById("departureTime-create");
    let station_code = document.getElementById("stationName-create");
    let train_code = document.getElementById("trainId-create");

    // Get the values from the form fields
    let arrivalTime = arrival_time.value;
    let departureTime = departure_time.value;
    let stationCode = station_code.value;
    let trainCode = train_code.value;

    // Put our data we want to send in a javascript object
    let data = {
        arrival_time: arrivalTime,
        departure_time: departureTime,
        station_code: stationCode,
        train_code: trainCode
    }

    if ( arrivalTime == "" || departureTime == "" || stationCode == "" || trainCode == "") 
    {
        alert("Please fill out all fields")
        return;
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_schedule_ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            arrival_time.value = '';
            departure_time.value='';
            station_code.value='';
            train_code.value='';
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
    let currentTable = document.getElementById("scheduleTableBody");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let scheduleIDcell = document.createElement("TD");
    let arrivalTimeIDcell = document.createElement("TD");
    let departureTimeIDcell = document.createElement("TD");
    let stationNameIDcell = document.createElement("TD");
    let trainCodeIDcell = document.createElement("TD");

    // Fill the cells with correct data
    scheduleIDcell.innerText = newRow.schedule_ID;
    arrivalTimeIDcell.innerText = newRow.arrival_time; 
    departureTimeIDcell.innerText = newRow.departure_time; 
    stationNameIDcell.innerText = newRow.station_code;
    trainCodeIDcell.innerText = newRow.train_code; 

    // Add the cells to the row 
    row.appendChild(scheduleIDcell);
    row.appendChild(arrivalTimeIDcell);
    row.appendChild(departureTimeIDcell);
    row.appendChild(stationNameIDcell);
    row.appendChild(trainCodeIDcell);
    
    
    // Add the row to the table
    currentTable.appendChild(row);

    document.location.reload(true);  
}
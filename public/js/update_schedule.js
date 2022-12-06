// Get the objects we need to modify
let updateOperatorForm = document.getElementById('updateScheduleForm');

// Modify the objects we need
updateOperatorForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let schedule_ID = document.getElementById("schedule_ID-update");
    let arrival_time = document.getElementById("arrivalTime-update");
    let departure_time = document.getElementById("departureTime-update");
    let station_code = document.getElementById("stationName-update");
    let train_code = document.getElementById("trainId-update");

    // Get the values from the form fields
    let scheduleID = schedule_ID.value;
    let arrivalTime = arrival_time.value;
    let departureTime = departure_time.value;
    let stationCode = station_code.value;
    let trainCode = train_code.value;

    // Sends window alert if form fields are left empty
    if (isNaN(scheduleID) || arrivalTime == "" || departureTime == "" || isNaN(stationCode) || isNaN(trainCode))
    {
        alert("Please fill out all form fields")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        schedule_ID: scheduleID,
        arrival_time: arrivalTime,
        departure_time: departureTime,
        station_code: stationCode,
        train_code: trainCode
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put_schedule", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, scheduleID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, scheduleID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("schedule_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == scheduleID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
    document.location.reload(true); 
}
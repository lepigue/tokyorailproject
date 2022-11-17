// Get the objects we need to modify
let updateLineForm = document.getElementById('updateLineForm');

// Modify the objects we need
updateLineForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let line_ID = document.getElementById("lineID-edit");
    let line_name = document.getElementById("lineName-edit")
    let start_station = document.getElementById("startStation-edit");
    let end_station = document.getElementById("endStation-edit");

    
    // Get the values from the form fields
    let lineID = line_ID.value;
    let lineName = line_name.value;
    let startStation = start_station.value;
    let endStation = end_station.value;

    if (isNaN(lineID)) 
    {
        return;
    }
    // IS THIS WHERE WE HANDLE NULL CONSTRAINTS OR IN APP.JS with an ALERT?
    //if (lineName == ""){
        //return;
    //}

    // Put our data we want to send in a javascript object
    let data = {
        line_ID: lineID,
        line_name: lineName,
        start_station: startStation,
        end_station: endStation
    }
    
    console.log("JS", data)
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put_line", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, lineID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, lineID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("line_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == lineID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}
// Get the objects we need to modify
let updateLineForm = document.getElementById('updateLineForm');

// Modify the objects we need
updateLineForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let line_ID = document.getElementById("lineID-edit");
    let line_name = document.getElementById("lineName-edit")

    
    // Get the values from the form fields
    let lineID = line_ID.value;
    let lineName = line_name.value;

    // Alert is sent if fields are left blank
    if (isNaN(lineID) || lineName == "") 
    {
        alert("Please fill out all fields and select a line to edit")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        line_ID: lineID,
        line_name: lineName,
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

            // Get td of line value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign line to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}
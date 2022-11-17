// Get the objects we need to modify
let updateTrainForm = document.getElementById('updateTrainForm');

// Modify the objects we need
updateTrainForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let train_ID = document.getElementById("selectTrainID");
    let model = document.getElementById("trainModel-update");
    let last_service_date = document.getElementById("serviceDate-update");
    let line_code = document.getElementById("lineName");

    
    // Get the values from the form fields
    let trainID = train_ID.value;
    let trainModel = model.value;
    let serviceDate = last_service_date.value;
    let lineID = line_code.value;

    if (isNaN(trainID)) 
    {
        alert("Please fill out all fields and select an train to edit")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        train_ID: trainID,
        model: trainModel,
        last_service_date: serviceDate,
        line_code: lineID
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put_train", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, trainID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, trainID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("train_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == trainID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}
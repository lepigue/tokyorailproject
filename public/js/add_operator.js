// Get the objects we need to modify
let addOperatorForm = document.getElementById('addOperatorForm-ajax');

// Modify the objects we need
addOperatorForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let first_name = document.getElementById("operatorFname-create");
    let last_name = document.getElementById("operatorLname-create");
    let phone_number = document.getElementById("phone-create");
    let email = document.getElementById("email-create");
    let train_code = document.getElementById("trainCode-create");

    // Get the values from the form fields
    let firstName = first_name.value;
    let lastName = last_name.value;
    let phoneNum = phone_number.value;
    let e_Mail = email.value;
    let trainCode = train_code.value;

    // Put our data we want to send in a javascript object
    let data = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNum,
        email: e_Mail,
        train_code: trainCode
    }


    if (firstName == "" || lastName == "" || trainCode == "") 
    {
        alert("Please fill out the all fields. Only email can be left blank")
        return;
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_operator_ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            first_name.value = '';
            last_name.value = '';
            phone_number.value = '';
            email.value = '';
            train_code.value = '';
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
    let currentTable = document.getElementById("operator_table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let operatorIDCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let phoneNumCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let trainCodeCell = document.createElement("TD");

    // Fill the cells with correct data
    operatorIDCell.innerText = newRow.line_ID;
    firstNameCell.innerText = newRow.line_name; 
    lastNameCell.innerText = newRow.start_station;
    phoneNumCell.innerText = newRow.end_Station;
    emailCell.innerText = newRow.start_station;
    trainCodeCell.innerText = newRow.end_Station;

    // Add the cells to the row 
    row.appendChild(operatorIDCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(phoneNumCell);
    row.appendChild(emailCell);
    row.appendChild(trainCodeCell);
    
    // Add the row to the table
    currentTable.appendChild(row);

    document.location.reload(true); 
}
// Get the objects we need to modify
let updateOperatorForm = document.getElementById('updateOpForm');

// Modify the objects we need
updateOperatorForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let operator_ID = document.getElementById("selectName");
    let first_name = document.getElementById("update-firstName");
    let last_name = document.getElementById("update-lastName");
    let phone_number = document.getElementById("update-phoneNumber");
    let email = document.getElementById("update-email");
    let train_code = document.getElementById("trainCode-edit");


    // Get the values from the form fields
    let opIDValue = operator_ID.value;
    let firstNameValue = first_name.value;
    let lastNameValue = last_name.value;
    let phoneNumberValue = phone_number.value;
    let emailValue = email.value;
    let trainCodeEdit = train_code.value;

    if (isNaN(opIDValue) || firstNameValue==""|| lastNameValue==""||isNaN(trainCodeEdit)) 
    {
        alert("All fields required except phone number or email")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        operator_ID: opIDValue,
        first_name: firstNameValue,
        last_name: lastNameValue,
        phone_number: phoneNumberValue,
        email: emailValue,
        train_code: trainCodeEdit
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put_operator", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, opIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, personID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("operator_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == personID) {

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
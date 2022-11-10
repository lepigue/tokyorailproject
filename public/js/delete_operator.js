function deleteOperator(personID) {
    // Put our data we want to send in a javascript object
    let data = {
        operator_ID: personID
    };
    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete_operator", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(personID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(personID){
    let table = document.getElementById("operator_table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == personID) {
            table.deleteRow(i);
            deleteDropDownMenu(personID);
            break;
       }
    }
}

function deleteDropDownMenu(personID){
    let selectMenu = document.getElementById("del_dropdown");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(personID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }
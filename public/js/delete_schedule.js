// Citation for this file
// Date: Dec 5, 2022
// Based on/inspired by: NodeJS starter app delete_person.js
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/delete_person.js

function deleteSchedule(scheduleID) {
    let data = {
      schedule_ID: scheduleID,
    };
  
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete_schedule_ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
  
    xhttp.onreadystatechange = () => {
      console.log(xhttp.readyState, xhttp.status);
      if (xhttp.readyState == 4 && xhttp.status == 204) {
        deleteRow(scheduleID);
        alert("Schedule successfully deleted!");
      } else if (xhttp.readyState == 4 && xhttp.status != 204) {
        console.log("There was an error with the input.");
      }
    };
    xhttp.send(JSON.stringify(data));
  }
  
  function deleteRow(scheduleID) {
    let table = document.getElementById("schedule_table");
    console.log(table);
    for (let i = 0, row; row = table.rows[i]; i++) {
      if (table.rows[i].getAttribute("data-value") == scheduleID) {
        table.deleteRow(i);
        break;
      }
    }
    document.location.reload(true); 
  }
  
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
  
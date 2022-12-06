// App.js

/*
    SETUP
*/
var express = require('express')   // We are using the express library for the web server
var app     = express()           // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
PORT        = 8451;                 // Set a port number at the top so it's easy to change in the future WAS *8451

// DATABASE
var db = require('./database/db-connector');

// HANDLEBARS
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
// GET ROUTES

app.get('/', function(req, res)
    {
        res.render('index')
    });              

app.get('/index', function(req, res)
    {
        res.render('index');                   
    });      
    
app.get('/line_view', function(req, res) {
  const lineId = req.query.lineId;
  let queryLines = 'SELECT * FROM \`Lines\` ORDER BY line_ID';
    db.pool.query(queryLines, function (error, rows, fields) {
      let lines = [];
      for (station of rows) {
        let new_station = {};
        for (const key in station) {
          new_station[key] = station[key];
        }
        if (new_station.line_name == "Hanzōmon") {
          new_station.lineAbbreviation = "Z";
        } else {
          new_station.lineAbbreviation = new_station.line_name.slice(0, 1);
        }
        lines.push(new_station);
      }

      let queryAlphabeticalLines = "SELECT * FROM `Lines` ORDER BY line_name";
      db.pool.query(queryAlphabeticalLines, function (error, rows, fields) {
        let alphabeticalLines = [];
        for (const line of rows) {
          let new_line = {};
          for (const key in line) {
            new_line[key] = line[key];
          }
          
          alphabeticalLines.push(new_line);
        }

        if (req.query.lineId) {
          let queryLine = `SELECT line_name FROM \`Lines\` WHERE line_ID = ${lineId}`;
          db.pool.query(queryLine, function (error, rows, fields) {
            let line_name = rows[0].line_name;

            let query_stations = `SELECT * FROM Stations WHERE line_code = ${lineId} ORDER BY station_num`;
            db.pool.query(query_stations, function (error, rows, fields) {
              let formattedStations = [];
              for (const [idx, station] of rows.entries()) {
                let new_station = {};
                for (const key in station) {
                  new_station[key] = station[key];
                }
                formattedStations.push(new_station);
              }
              res.render("line_view", {
                stations: formattedStations,
                alphabeticalLines: alphabeticalLines,
                line_name: line_name,
                line_code: lineId,
                line_abbreviation: lines[lineId - 1].lineAbbreviation,
                firstStation: formattedStations[0],
                lastStation: formattedStations[formattedStations.length - 1],
              });
            });
          });
        } else {
          res.render("line_view", {
            stations: null,
            alphabeticalLines: alphabeticalLines,
            line_name: null,
            line_code: null,
            firstStation: null,
            lastStation: null,
          });
        }
      });
    });
});

// GETS ROUTES, RENDERS DATA IN TABLES AND PAGES

app.get("/line_edit", function(req, res)
    {
        let query1 = "SELECT * FROM `Lines`;";
        let query2 = "SELECT * FROM Stations;";
        db.pool.query(query1, function(error, rows, fields){
          let lines = rows;
          db.pool.query(query2, (error, rows, fields)=>{
            let stations = rows;
            return res.render('line_edit', {data: lines, stations: stations});
          })
        })
    });

app.get("/operator_edit", function (req, res) 
{
  let query1 = "SELECT * FROM Operators;";
  let query2 = "SELECT * FROM Trains;";
  db.pool.query(query1, function(error, rows, fields){
    let operators = rows;
    db.pool.query(query2, (error, rows, fields)=>{
      let trains = rows;
      return res.render('operator_edit', {data: operators, trains: trains});
    })
  })
});

app.put("/station_edit", function (req, res) {


  res.redirect("/station_edit");
})

app.post("/station_edit", function (req, res) {
  let formData = req.body;

    let queryNextStationNum = `SELECT MAX(station_num) AS maxStationNum from Stations WHERE line_code = ${req.body.lineID}`;
    db.pool.query(queryNextStationNum, function (error, rows, fields) {
      let newStationNum = rows[0].maxStationNum + 1;
    
      let queryNewStation = `INSERT INTO Stations (location_name, station_num, line_code) VALUES (\'${formData.stationName}\', ${newStationNum}, ${formData.lineID})`;
      db.pool.query(queryNewStation, function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          res.redirect("/station_edit");
        }
      })
    })
})

app.get("/station_edit", function (req, res)  {
  let query_lines = `SELECT * FROM \`Lines\``;
  db.pool.query(query_lines, function (error, rows, fields) {
    console.log(rows);
    let lines = [];
    for (const line of rows) {
      let new_line = {};
      new_line.line_ID = line.line_ID;
      new_line.line_name = line.line_name;
      lines.push(new_line);
    }

    let queryStations = "SELECT * FROM `Stations` ORDER BY location_name;";
    db.pool.query(queryStations, function (error, rows, fields) {
      
      let stations = {};
      let stationsAlphabetical = [];
      for (const station of rows) {
        let new_station = {};
        for (const key in station) {
          new_station[key] = station[key];
        }
        new_station.line_name =
          lines[new_station.line_code - 1].line_name;
        stationsAlphabetical.push(new_station);
        stations[new_station.station_ID] = new_station;
      }

      let stationEdit = {
        stationName: req.query.stationName,
        stationNum: req.query.stationNum,
        lineName: req.query.lineID ? lines[req.query.lineID - 1].line_name : null,
        lineID: req.query.lineID,
        stationID: req.query.stationID,
      }
      res.render("station_edit", {
        stations: stations,
        stationsAlphabetical: stationsAlphabetical,
        lines: lines,
        stationEdit: stationEdit,
      });
    })
  })
});

app.get('/train_edit', function(req, res)
    {
        let query1 = "SELECT * FROM Trains;";
        let query2 = "SELECT * FROM `Lines`;";
        db.pool.query(query1, function(error, rows, fields){
          let trains = rows;
          db.pool.query(query2, (error, rows, fields)=>{
            let lines = rows;
            return res.render('train_edit', {data: trains, lines: lines});
          })
        })
    });

app.get("/schedule_edit", function (req, res)
    {
        let query1 = "SELECT * FROM Schedules;";
        let query2 = "SELECT * FROM Stations;";
        let query3 = "SELECT * FROM Trains;";
        db.pool.query(query1, function(error, rows, fields){
          let schedules = rows;
          db.pool.query(query2, (error, rows, fields)=>{
            let stations = rows;
            db.pool.query(query3, (error, rows, fields)=>{
              let trains = rows;
              return res.render('schedule_edit', {data: schedules, stations: stations, trains: trains});
          })
        })
      })
    });
      

app.get('/operator_view', function(req, res) {
  let query_trains = `SELECT train_ID, model, line_code FROM Trains`;
  db.pool.query(query_trains, function (error, rows, fields) {
    let trains = {};
    for (const train of rows) {
      let new_train = {};
      for (const key in train) {
        new_train[key] = train[key];
      }
      trains[new_train.train_ID] = new_train;
    }

    let query_ops = `SELECT * FROM Operators ORDER BY last_name`;
    db.pool.query(query_ops, function (error, rows, fields) {
      let operators = [];
      for (const operator of rows) {
        let new_operator = {};
        for (const key in operator) {
          new_operator[key] = operator[key];
        }
        operators.push(new_operator);
      }
      if (req.query.operatorID) {
        let query_op = `SELECT * FROM Operators WHERE operator_ID = ${req.query.operatorID}`;
        db.pool.query(query_op, function (error, rows, fields) {
          let operator = {};
          for (const key in rows[0]) {
            operator[key] = rows[0][key];
          }
          operator.currTrain = trains[operator.train_code];
          res.render("operator_view", {
            operator: operator,
            operators: operators,
          });
        });
      } else {
        res.render("operator_view", { operator: null, operators: operators });
      }
    });
  });
});
    
app.get("/station_view", function (req, res) {
  const stationID = req.query.stationID;
  const lineID = req.query.lineID;
  let query_stations = `SELECT * FROM Stations`;
  db.pool.query(query_stations, function (error, rows, fields) {
    let stations = {};
    for (const station of rows) {
      let new_station = {};
      for (const key in station) {
        new_station[key] = station[key];
      }
      stations[new_station.station_ID] = new_station;
    }

    // Build map of line ID to line name for use in UI
    let query_lines = `SELECT * FROM \`Lines\``;
    db.pool.query(query_lines, function (error, rows, fields) {
      const linesMap = {};
      for (const line of rows) {
        let new_line = {};
        new_line.line_ID = line.line_ID;
        new_line.line_name = line.line_name
        linesMap[new_line.line_ID] = new_line;
      }

        if (stationID) {
          // Build map of trains for Schedules
          let query_trains = `SELECT * FROM Trains WHERE line_code = (SELECT line_code FROM Stations WHERE station_ID = ${stationID})`;
          db.pool.query(query_trains, function (error, rows, fields) {
            let trains = {};
            for (const train of rows) {
              let new_train = {};
              for (const key in train) {
                new_train[key] = train[key];
              }
              trains[new_train.train_ID] = new_train;
            }

              // Create list of all schedules that pass through this station
            let query_schedules = `SELECT * FROM Schedules WHERE station_code = ${stationID} ORDER BY arrival_time;`;
            db.pool.query(query_schedules, function (error, rows, fields) {
              let schedules = [];
              for (const schedule of rows) {
                let new_schedule = {};
                for (const key in schedule) {
                  new_schedule[key] = schedule[key];
                }
                new_schedule.station_name =
                  stations[new_schedule.station_code].location_name;
                new_schedule.train_name = `Train ${
                  new_schedule.train_code
                } - ${trains[new_schedule.train_code].model}`;
                schedules.push(new_schedule);
              }

              //
              let query_station = `SELECT * FROM Stations WHERE station_ID = ${stationID}`;
              db.pool.query(query_station, function (error, rows, fields) {
                let station = {};
                for (const key in rows[0]) {
                  station[key] = rows[0][key];
                }
                station.line_name = linesMap[station.line_code].line_name;

                if (lineID) {
                  let query_line_stations = `SELECT station_ID, location_name FROM Stations WHERE line_code = ${lineID} ORDER BY station_num`;
                  db.pool.query(query_line_stations, function (error, rows, fields) {
                    let lineStations = {};
                    for (const station of rows) {
                      let new_station = {};
                      for (const key in station) {
                        new_station[key] = station[key];
                      }
                    lineStations[new_station.station_ID] = new_station;
                    }
                    res.render("station_view", {
                      lines: linesMap,
                      curr_line: linesMap[lineID],
                      lineStations: lineStations,
                      station: station,
                      schedules: schedules
                    });
                  });
                } else {
                  let query_station = `SELECT * FROM Stations WHERE station_ID = ${stationID}`;
                  db.pool.query(query_station, function (error, rows, fields) {
                    let station = {};
                    for (const key in rows[0]) {
                      station[key] = rows[0][key];
                    }
                    station.line_name = linesMap[station.line_code].line_name;
                    res.render("station_view", {
                      lines: linesMap,
                      curr_line: linesMap[station.line_code],
                      lineStations: null,
                      station: station,
                      schedules: schedules,
                    });
                  })
                }
              });
            });
          });        
      } else if (lineID) {
        let query_line_stations = `SELECT station_ID, location_name FROM Stations WHERE line_code = ${lineID} ORDER BY station_num`;
        db.pool.query(query_line_stations, function (error, rows, fields) {
          let lineStations = {};
          for (const station of rows) {
            let new_station = {};
            for (const key in station) {
              new_station[key] = station[key];
            }
          lineStations[new_station.station_ID] = new_station;
          }
          res.render("station_view", {
            lines: linesMap,
            curr_line: linesMap[lineID],
            lineStations: lineStations,
            station: null,
            schedules: null,
          });
        })
      } else {
        res.render("station_view", {
          lines: linesMap,
          curr_line: null,
          lineStations: null,
          station: null,
          schedules: null
        });
      }
    });
  })
});


app.get('/train_view', function(req, res) {
  // Build map of line ID to line name for use in UI
  let query_lines = `SELECT * FROM \`Lines\``;
  db.pool.query(query_lines, function (error, rows, fields) {
    const linesMap = {};
    for (const line of rows) {
      linesMap[line.line_ID] = line.line_name
    }
    // Build list of all trains for use in dropdown menu
    let query_trains = `SELECT * FROM Trains`;
    db.pool.query(query_trains, function (error, rows, fields) {
      let trains = [];
      for (const train of rows) {
        let new_train = {};
        for (const key in train) {
          new_train[key] = train[key];
        }
        trains.push(new_train);
      }
      if (req.query.trainID) {
        const trainID = req.query.trainID;

        let query_operators = `SELECT * FROM Operators WHERE train_code = ${trainID}`;
        db.pool.query(query_operators, function (error, rows, fields) {
          let operators = [];
          for (const operator of rows) {
            let new_operator = {};
            for (const key in operator) {
              new_operator[key] = operator[key];
            }
            operators.push(new_operator);
          }
          
          // Query individual train for display on view page
          let query_train = `SELECT * FROM Trains WHERE train_ID = ${trainID}`;
          db.pool.query(query_train, function (error, rows, fields) {
            let train = {};
            for (const key in rows[0]) {
              train[key] = rows[0][key];
            }
            train.line_name = linesMap[train.line_code];
            let multiOps = (operators.length > 1) ? true : false;
            res.render("train_view", {
              train: train,
              trains: trains,
              operators: operators,
              multiOps: multiOps,
            });
          });
        });
      } else {
        res.render("train_view", {
          train: null,
          trains: trains,
          operators: null,
        });
      }
    })
  })
});



// POST ROUTES
app.post('/add_operator_ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Convert empty form values to "NULL" string
    let email = data.email;
    if (email == "")
    {
        email = 'NULL'
    }

    let phone_number = parseInt(data.phone_number);
    if (isNaN(phone_number))
    {
        phone_number = 'NULL'
    }
  

    // Create the query and run it on the database
    query1 = `INSERT INTO Operators (first_name, last_name, phone_number, email, train_code) VALUES ('${data.first_name}', '${data.last_name}', '${phone_number}', '${email}', '${data.train_code}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Operators;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add_schedule_ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // Create the query and run it on the database
    query1 = `INSERT INTO Schedules (arrival_time, departure_time, station_code, train_code ) VALUES ('${data.arrival_time}','${data.departure_time}','${data.station_code}', '${data.train_code}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Schedules;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});



app.post('/add_line_ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // Create the query and run it on the database
    query1 = `INSERT INTO \`Lines\` (line_name) VALUES ('${data.line_name}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM \`Lines\``;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


app.post('/add_train_ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Trains (model, last_service_date, line_code) VALUES ('${data.model}', '${data.last_service_date}', '${data.line_code}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Trains;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});






// DELETE ROUTES

app.delete('/delete_schedule_ajax/', function(req,res,next){
  let data = req.body;
  let schedule_ID = parseInt(data.schedule_ID);
  let deleteSchedule= `DELETE FROM Schedules WHERE schedule_ID = ?`;


        // Run the 1st query
        db.pool.query(deleteSchedule, [schedule_ID], function(error, rows, fields){
            if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
            else
            {
              res.sendStatus(204);    
            }
        })
  });

app.delete('/delete_line_ajax/', function(req,res,next){
  let data = req.body;
  let lineID = parseInt(data.line_ID);
  let deleteLine= `DELETE FROM \`Lines\` WHERE line_ID = ?`;


        // Run the 1st query
        db.pool.query(deleteLine, [lineID], function(error, rows, fields){
            if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
            else
            {
              res.sendStatus(204);    
            }
        })
  });

app.delete('/delete_train_ajax/', function(req,res,next){
  let data = req.body;
  let trainID = parseInt(data.train_ID);
  let deleteSchedule = `DELETE FROM Schedules WHERE train_code = ?`;
  let deleteTrain= `DELETE FROM Trains WHERE train_ID = ?`;


        // Run the 1st query
        db.pool.query(deleteSchedule, [trainID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                // Run the second query
                db.pool.query(deleteTrain, [trainID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
})});



app.delete('/delete_operator', function(req,res,next){
    let data = req.body;
    let operatorID = parseInt(data.operator_ID);
    let deleteOp = `DELETE FROM Operators WHERE operator_ID  = ?`;
          // Run query
          db.pool.query(deleteOp, [operatorID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else {
                res.sendStatus(204);
              }
              
        })
    });

app.delete("/delete_station", function (req, res, next) {
  let station_ID = parseInt(req.body.station_ID);
  let queryDeleteStation = `DELETE FROM Stations WHERE station_ID=?`;
  db.pool.query(
    queryDeleteStation,
    [station_ID],
    function (error, rows, fields) {
      if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    }
  );
});
// PUT ROUTES


app.put('/put_schedule', function(req,res,next){                                   
  let data = req.body;
  let schedule_ID = parseInt(data.schedule_ID);
  let arrival_time = data.arrival_time;
  let departure_time = data.departure_time;        
  let station_code = parseInt(data.station_code);
  let train_code = parseInt(data.station_code);


  queryUpdateTrain = `UPDATE Schedules SET arrival_time=?, departure_time=?, station_code=?, train_code=? WHERE Schedules.schedule_ID = ?` ;
  selectTrain = `SELECT * FROM Schedules WHERE schedule_ID = ?`

        // Run the 1st query
        db.pool.query(queryUpdateTrain, [arrival_time, departure_time, station_code, train_code, schedule_ID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectTrain, [schedule_ID], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
 })
});


app.put('/put_line', function(req,res,next){                                   
  let data = req.body;
  let line_ID = parseInt(data.line_ID);
  let line_name = data.line_name;

  queryUpdateLine = `UPDATE \`Lines\` SET line_name=? WHERE \`Lines\`.line_ID = ?` ;
  selectLine = `SELECT * FROM \`Lines\` WHERE line_ID = ?`

        // Run the 1st query
        db.pool.query(queryUpdateLine, [line_name, line_ID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectLine, [line_ID], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
 })
});

app.put('/put_train', function(req,res,next){                                   
  let data = req.body;
  let train_ID = parseInt(data.train_ID);
  let model = data.model;
  let last_service_date = data.last_service_date;
  let line_code = parseInt(data.line_code);

  queryUpdateTrain = `UPDATE Trains SET model=?, last_service_date=?, line_code=? WHERE Trains.train_ID = ?` ;
  selectTrain = `SELECT * FROM Trains WHERE train_ID = ?`

        // Run the 1st query
        db.pool.query(queryUpdateTrain, [model, last_service_date, line_code, train_ID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectTrain, [train_ID], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
 })
});

app.put('/put_operator', function(req,res,next){ 
    let data = req.body;
    let operator_ID = parseInt(data.operator_ID);
    let first_name = data.first_name;
    let last_name = data.last_name;
    let phone_number = parseInt(data.phone_number);
    //let phone_number = data.phone_number;
    let email = data.email;
    let train_code = data.train_code

    if (email == "")
    {
        email = 'NULL'
    }

    if (isNaN(phone_number))
    {
        phone_number = 'NULL'
    }
    
  
    queryUpdateOp = `UPDATE Operators SET first_name=?, last_name=?, phone_number=?, email = ?, train_code = ? WHERE Operators.operator_ID = ?`;
    selectOp = `SELECT * FROM Operators WHERE operator_id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateOp, [first_name, last_name, phone_number, email, train_code, operator_ID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectOp, [operator_ID], function(error, rows, fields) {
          
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
   }) 
});

app.put("/put_station", function (req, res, next) {
  let queryLines = `SELECT * from \`Lines\` ORDER BY line_ID`;
  db.pool.query(queryLines, function (error, rows, fields) {
    const lines = rows;
    let data = req.body;
    let station_ID = parseInt(data.stationID);
    let location_name = data.stationName;
    let station_num = data.stationNum;
    let line_code = parseInt(data.lineID);


    // WORKING ON REQUIRING INPUT FROM FORM TO ENSURE "NOT NULL" IS ACCURATE
    //if (operator_ID == NaN || first_name == "" || last_name == "" || phone_number == NaN || email ==""){
    //alert('Please enter all fields');
    //}

    let queryUpdateStation = `UPDATE Stations SET location_name=?, station_num=?, line_code=? WHERE station_ID=?`;
    let selectNewStation = `SELECT * FROM Stations WHERE station_ID=?`;

    // Run the 1st query
    db.pool.query(
      queryUpdateStation,
      [location_name, station_num, line_code, station_ID],
      function (error, rows, fields) {
        if (error) {
          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error);
          res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
          // Run the second query
          db.pool.query(
            selectNewStation,
            [station_ID],
            function (error, rows, fields) {
              if (error) {
                console.log(error);
                res.sendStatus(400);
              } else {
                rows[0].line_name = lines[rows[0].line_code - 1].line_name;
                res.send(rows);
              }
            }
          );
        }
      }
    );
  })
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});


// App.js

/*
    SETUP
*/
var express = require('express')   // We are using the express library for the web server
var app     = express()           // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
PORT        = 8451;                 // Set a port number at the top so it's easy to change in the future

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
  let query_lines = 'SELECT * FROM \`Lines\` ORDER BY line_name';
  db.pool.query(query_lines, function (error, rows, fields) {
    let lines = [];
    for (const line of rows) {
      let new_line = {};
      for (const key in line) {
        new_line[key] = line[key];
      }
      lines.push(new_line);
    }

    if (req.query.lineId) {
      let queryLine = `SELECT line_name FROM \`Lines\` WHERE line_ID = ${lineId}`;
      db.pool.query(queryLine, function(error, rows, fields) {
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
            lines: lines,
            line_name: line_name,
            line_code: lineId,
          });
        })
      })
    } else {
      res.render("line_view", {
        stations: null,
        lines: lines,
        line_name: null,
        line_code: null,
        firstStation: null,
        lastStation: null,
      });
    }
  })
});

app.get('/line_template', function(req, res)
    {
        res.render('line_template');
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

app.get("/station_edit", function (req, res) 
  {
    let query1 = "SELECT * FROM Stations;";    
    db.pool.query(query1, function(error, rows, fields){
        res.render('station_edit', {data: rows});
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


app.get('/station_template', function(req, res)
    {
        res.render('station_template');                    
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
                  console.log(schedules);
                  res.render("station_view", {
                    lines: linesMap,
                    curr_line: linesMap[lineID],
                    lineStations: lineStations,
                    station: station,
                    stations: lineStations,
                    schedules: schedules
                  });
                });
              });
            });
          } else {
            console.log(linesMap[lineID]);
            res.render("station_view", {
              lines: linesMap,
              curr_line: linesMap[lineID],
              lineStations: lineStations,
              station: null,
              stations: lineStations,
              schedules: null
            });
          }
        });
      } else {
        res.render("station_view", {
          lines: linesMap,
          curr_line: null,
          lineStations: null,
          station: null,
          stations: null,
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
          console.log(operators);
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
    // Create the query and run it on the database
    query1 = `INSERT INTO Operators (first_name, last_name, phone_number, email, train_code) VALUES ('${data.first_name}', '${data.last_name}', '${data.phone_number}', '${data.email}', '${data.train_code}');`;
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


// PUT ROUTES

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
    let email = data.email;
    let train_code = data.train_code

    // WORKING ON REQUIRING INPUT FROM FORM TO ENSURE "NOT NULL" IS ACCURATE
    //if (operator_ID == NaN || first_name == "" || last_name == "" || phone_number == NaN || email ==""){
      //alert('Please enter all fields');
    //}
  
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


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});


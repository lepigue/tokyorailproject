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
  let query_lines = 'SELECT * FROM \`Lines\` ORDER BY line_name';
  db.pool.query(query_lines, function (error, rows, fields) {
    let lineData = {};
    let lines = [];
    for (const line of rows) {
      let new_line = {};
      for (const key in line) {
        new_line[key] = line[key];
      }
      lines.push(new_line);
    }

    if (req.query.lineId) {
      let queryLine = `SELECT line_name FROM \`Lines\` WHERE line_ID = ${req.query.lineId}`;
      db.pool.query(queryLine, function(error, rows, fields) {
        let line_name = rows[0].line_name;

        let query_stations = `SELECT location_name FROM Stations WHERE line_code = ${req.query.lineId} ORDER BY station_num`;
        db.pool.query(query_stations, function (error, rows, fields) {
          console.log(rows);
          let nonTerminalStations = [];
          for (const [idx, station] of rows.entries()) {
            if (idx === 0) {
              lineData.firstStation = station.location_name;
            } else if (idx === rows.length - 1) {
              lineData.lastStation = station.location_name;
            } else {
              let new_station = {};
              for (const key in station) {
                new_station[key] = station[key];
                nonTerminalStations.push(new_station);
              }
            }
          }
          res.render("line_view", {
            nonTerminalStations: nonTerminalStations,
            lines: lines,
            line_name: line_name,
            lineData: lineData,
          });
        })
      })
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
        db.pool.query(query1, function(error, rows, fields){
            res.render('line_edit', {data: rows});
        })
    });

app.get("/operator_edit", function (req, res) 
  {
    let query1 = "SELECT * FROM `Operators`;";
    db.pool.query(query1, function (error, rows, fields){
        res.render('operator_edit', { data: rows });
    })
  }); 

app.get("/station_edit", function (req, res) 
  {
    let query1 = "SELECT * FROM `Stations`;";
    db.pool.query(query1, function(error, rows, fields){
        res.render('station_edit', {data: rows});
    })
  });

app.get('/train_edit', function(req, res)
    {
        let query1 = "SELECT * FROM `Trains`;";
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
        let query1 = "SELECT * FROM `Schedules`;";
        db.pool.query(query1, function(error, rows, fields){
            console.log(rows)
            res.render('schedule_edit', {data: rows});
        })
    });


app.get('/operator_view', function(req, res) {
  let query_ops = `SELECT * FROM Operators`;
  db.pool.query(query_ops, function (error, rows, fields) {
    let operators = [];
    let query_op = `SELECT * FROM Operators WHERE operator_ID = ${req.query.operatorID}`;
    
    for (const operator of rows) {
      let new_operator = {};
      for (const key in operator) {
        new_operator[key] = operator[key]
      }
      operators.push(new_operator);
    }
    if (req.query.operatorID) {
      db.pool.query(query_op, function (error, rows, fields) {
          let operator = {};
          for (const key in rows[0]) {
            operator[key] = rows[0][key];
          }
      res.render("operator_view", { operator: operator, operators: operators });
      });
    } else { 
      res.render("operator_view", { operator: null, operators: operators });
    }
  })
});


app.get('/station_template', function(req, res)
    {
        res.render('station_template');                    
    }); 
    
app.get("/station_view", function (req, res) {
  const stationID = req.query.stationID;
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

      if (stationID) {
        // Build map of line ID to line name for use in UI
        let query_lines = `SELECT * FROM \`Lines\``;
        db.pool.query(query_lines, function (error, rows, fields) {
          const linesMap = {};
          for (const line of rows) {
            linesMap[line.line_ID] = line.line_name;
          }

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

            // Get Operator
            let query_operators = `SELECT * FROM Operators;`; // TODO: add WHERE train_code = (SELECT * FROM )
            db.pool.query(query_operators, function (error, rows, fields) {
              let operators = {};    // Train_ID : Operator Display Name
              for (const train_ID in trains) {
                operators[train_ID] = [];
              }
              for (const operator of rows) {
                if (operator.train_code in trains) {
                  operators[operator.train_code] = operators[
                    operator.train_code
                  ].push(`${operator.last_name} ${operator.first_name}`);
                }
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
                  new_schedule.train_operator = `${
                    operators[new_schedule.train_code]
                  }`;
                  schedules.push(new_schedule);
                }

                //
                let query_station = `SELECT * FROM Stations WHERE station_ID = ${stationID}`;
                db.pool.query(query_station, function (error, rows, fields) {
                  let station = {};
                  for (const key in rows[0]) {
                    station[key] = rows[0][key];
                  }
                  station.line_name = linesMap[station.line_code];
                  res.render("station_view", {
                    station: station,
                    stations: stations,
                    schedules: schedules,
                    operators: operators,
                  })
                })
              })
            })
          })
        })
      } else {
        res.render("station_view", { station: null, stations: stations });
      }
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
        // Query individual train for display on view page
        let query_train = `SELECT * FROM Trains WHERE train_ID = ${req.query.trainID}`;
        db.pool.query(query_train, function (error, rows, fields) {
          let train = {};
          for (const key in rows[0]) {
            train[key] = rows[0][key];
          }
          train.line_name = linesMap[train.line_code]
          res.render("train_view", { train: train, trains: trains });
        });
      } else {
        res.render("train_view", { train: null, trains: trains });
      }
    })
  })
});



// POST ROUTES
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


app.post('/addLineForm', function(req, res){
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;
  console.log(data)
  // Create the query and run it on the database
  query1 = `INSERT INTO Lines (line_name, start_station, end_station) VALUES ('${data['lineName']}', '${data['startStation']}','${data['endStation']}')`;
  db.pool.query(query1, function(error, rows, fields){
  
      // Check to see if there was an error
      if (error) {
  
          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error)
          res.sendStatus(400);
      }
  
      // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
      // presents it on the screen
      else
      {
          res.redirect('/line_edit');
      }
  })
});


app.post('/addOperatorForm', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // Create the query and run it on the database
    query1 = `INSERT INTO Operators (first_name, last_name, phone_number, email) VALUES ('${data['firstName']}', '${data['lastName']}','${data['phoneNumber']}','${data['email']}')`;
    db.pool.query(query1, function(error, rows, fields){
    
        // Check to see if there was an error
        if (error) {
    
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
    
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/operator_edit');
        }
    })
});





// DELETE ROUTES

app.delete('/delete_train-ajax/', function(req,res,next){
  let data = req.body;
  let trainID = parseInt(data.id);
  let lineDel = `DELETE FROM Trains WHERE line_code = ?`;
  let trainDel= `DELETE FROM Trains WHERE train_id = ?`;


        // Run the 1st query
        db.pool.query(lineDel, [trainID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                // Run the second query
                db.pool.query(trainDel, [trainID], function(error, rows, fields) {

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
app.put('/put_operator', function(req,res,next){                                   
    let data = req.body;
  
    let operator_ID = parseInt(data.operator_ID);
    let first_name = data.first_name;
    let last_name = data.last_name;
    let phone_number = parseInt(data.phone_number);
    let email = data.email;
  
    queryUpdateOp = `UPDATE Operators SET first_name=?, last_name=?, phone_number=?, email = ? WHERE Operators.operator_ID = ?`;
    selectOp = `SELECT * FROM Operators WHERE operator_id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateOp, [first_name, last_name, phone_number, email, operator_ID], function(error, rows, fields){
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


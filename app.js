let convertDatetime = require('./public/js/convertDatetime.js');

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
const { convertDatetimeHTML } = require('./public/js/convertDatetime.js');
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
      let lines = {};
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
        lines[new_station.line_ID] = new_station;
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
                line_abbreviation: lines[lineId].lineAbbreviation,
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

app.get("/line_edit", function(req, res) {
  let queryLines = "SELECT * FROM `Lines`;";
  db.pool.query(queryLines, function (error, rows, fields) {
    let lines = rows;

    let queryLinesAlphabetical = `SELECT * FROM \`Lines\` ORDER BY line_name`;
      db.pool.query(queryLinesAlphabetical, (error, rows, fields) => {
        let linesAlphabetical = rows;
      
      let queryStations = "SELECT * FROM Stations;";
      db.pool.query(queryStations, (error, rows, fields) => {
        let stations = rows;
        return res.render("line_edit", {
          lines: lines,
          stations: stations,
          linesAlphabetical: linesAlphabetical,
        });
      }); 
    }); 
  });
});

app.get("/operator_edit", function (req, res) 
{
  let queryTrains = "SELECT * FROM Trains;";
  db.pool.query(queryTrains, (error, trainRows, fields) => {
    let trainMap = {};
    for (train of trainRows) {
      let newTrain = {};
      for (key in train) {
        newTrain.key = train[key];
      }
      trainMap[train.train_ID] = train;
    }

    let queryOperators = "SELECT * FROM Operators";
    db.pool.query(queryOperators, function (error, operatorRows, fields) {
    for (operator of operatorRows) {
      let currTrain = trainMap[operator.train_code];
      operator.train_name = `${currTrain.train_ID} - ${currTrain.model}`;
    }
      return res.render("operator_edit", {
        data: operatorRows,
        trains: trainRows,
      });
    });
  });
});

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
  let query_lines = `SELECT ROW_NUMBER() OVER (ORDER BY line_name) row_num, line_ID, line_name FROM \`Lines\` ORDER BY line_name`;
  db.pool.query(query_lines, function (error, rows, fields) {
    let lines = {};
    let linesAlphabetical = [];
    for (const line of rows) {
      let new_line = {};
      for (const key in line) {
        new_line[key] = line[key];
      }
      lines[new_line.line_ID] = new_line;
      linesAlphabetical.push(new_line);
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
          lines[new_station.line_code].line_name;
        new_station.row_num = lines[new_station.line_code].row_num;
        stationsAlphabetical.push(new_station);
        stations[new_station.station_ID] = new_station;
      }
      let stationEdit = {
        stationName: req.query.stationName,
        stationNum: req.query.stationNum,
        lineName: req.query.lineID ? lines[req.query.lineID].line_name : null,
        lineID: req.query.lineID,
        stationID: req.query.stationID,
        row_num: lines[req.query.lineID] ? lines[req.query.lineID].row_num : null
      }
      res.render("station_edit", {
        stations: stations,
        stationsAlphabetical: stationsAlphabetical,
        lines: lines,
        linesAlphabetical: linesAlphabetical,
        stationEdit: stationEdit,
      });
    })
  })
});

app.get('/train_edit', function(req, res)
  {
    let queryLines = "SELECT * FROM `Lines`;";
    db.pool.query(queryLines, function (error, rows, fields) {
      let linesMap = {};
      for (const line of rows) {
        let newLine = {};
        for (key in line) {
          newLine[key] = line[key]
        }
        linesMap[newLine.line_ID] = newLine;
      }

      let queryTrains =
        "SELECT train_ID, model, last_service_date, line_code FROM Trains;";
      db.pool.query(queryTrains, (error, rows, fields) => {
        let trains = rows;
        for (const train of trains) {
          train.line_name = linesMap[train.line_code].line_name;
          if (train.last_service_date) {
            let last_service_date = convertDatetime.convertDateToUTC(new Date(train.last_service_date));
            train.last_service_date_readable = convertDatetime.convertDatetime(last_service_date);
            train.last_service_date_HTML = convertDatetime.convertDatetimeHTML(last_service_date);
          }
        }
        
        return res.render("train_edit", { trains: trains, lines: linesMap });
      });
    });
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
  let queryTrains = `SELECT train_ID, model, line_code FROM Trains`;
  db.pool.query(queryTrains, function (error, rows, fields) {
    let trains = {};
    for (const train of rows) {
      let new_train = {};
      for (const key in train) {
        new_train[key] = train[key];
      }
      trains[new_train.train_ID] = new_train;
    }

    let queryOps = `SELECT * FROM Operators ORDER BY last_name`;
    db.pool.query(queryOps, function (error, rows, fields) {
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
    let queryAlphabeticalLines = `SELECT * FROM \`Lines\` ORDER BY line_name`;
    db.pool.query(queryAlphabeticalLines, function (error, rows, fields) {
      let linesAlphabetical = rows;
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
                        linesAlphabetical: linesAlphabetical,
                        curr_line: linesMap[lineID],
                        lineStations: lineStations,
                        station: station,
                        schedules: schedules,
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
                        linesAlphabetical: linesAlphabetical,
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
              linesAlphabetical: linesAlphabetical,
              curr_line: linesMap[lineID],
              lineStations: lineStations,
              station: null,
              schedules: null,
            });
          })
        } else {
          res.render("station_view", {
            lines: linesMap,
            linesAlphabetical: linesAlphabetical,
            curr_line: null,
            lineStations: null,
            station: null,
            schedules: null,
          });
        }
      });
    })
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
            train.last_service_date = convertDatetime.convertDatetimeText(train.last_service_date);
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
  let newOperator = req.body;
  const queryTrain = `SELECT * FROM Trains WHERE train_ID = ${newOperator.train_code}`;
  db.pool.query(queryTrain, function (error, rows, fields) {
    const train = rows[0]

    const queryAddOperator = `INSERT INTO Operators (first_name, last_name, phone_number, email, train_code) VALUES ('${newOperator.first_name}', '${newOperator.last_name}', '${newOperator.phone_number}', '${newOperator.email}', '${newOperator.train_code}');`;
    db.pool.query(queryAddOperator, function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        const queryAddedOperator = `SELECT * FROM Operators WHERE operator_ID = (SELECT MAX(operator_ID) FROM Operators) `;
        db.pool.query(queryAddedOperator, function (error, rows, fields) {
          let addedOperator = rows[0];
          addedOperator.train_name = `${train.train_ID} - ${train.model}`;
          const queryAllOperators = `SELECT * FROM Operators`;
          db.pool.query(queryAllOperators, function (error, operators, fields) {
            if (error) {
              console.log(error);
              res.sendStatus(400);
            } else {
              res.send({ operators: operators,
                        operator: addedOperator});
            }
          });
        });
      }
    });
  })
});


app.post('/add_line_ajax', function(req, res) 
{
  let line = req.body;
  query1 = `INSERT INTO \`Lines\` (line_name) VALUES ('${line.line_name}');`;
  db.pool.query(query1, function(error, rows, fields){
    if (error) {
        console.log(error)
        res.sendStatus(400);
    }
    else
    {
      query2 = `SELECT * FROM \`Lines\``;
      db.pool.query(query2, function(error, rows, fields){
        if (error) {
          console.log(error);
          res.sendStatus(400);
        }
        else
        {
          res.send(rows);
        }
      })
    }
  })
});


app.post("/add_station_ajax", function (req, res) {
  let station = req.body;

  let queryStationNum = `SELECT MAX(station_num) AS stationNum from Stations WHERE line_code = ${station.lineID}`;
  db.pool.query(queryStationNum, function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      station.stationNum = rows[0].stationNum + 1;
      
      let queryAddStation = `INSERT INTO Stations (location_name, station_num, line_code) VALUES ('${station.stationName}', ${station.stationNum}, ${station.lineID})`;
      db.pool.query(queryAddStation, function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          let queryLineName = `SELECT line_name AS lineName from \`Lines\` WHERE line_ID = ${station.lineID}`;
          db.pool.query(queryLineName, function (error, rows, fields) {
            if (error) {
              console.log(error);
              res.sendStatus(400);
            } else {
              station.lineName = rows[0].lineName;

              let queryStationNum = `SELECT MAX(station_ID) AS stationID from Stations`;
              db.pool.query(queryStationNum, function (error, rows, fields) {
                if (error) {
                  console.log(error);
                  res.sendStatus(400);
                } else {
                  station.stationID = rows[0].stationID;

                  let query_lines = `SELECT ROW_NUMBER() OVER (ORDER BY line_name) row_num, line_ID, line_name FROM \`Lines\` ORDER BY line_name`;
                  db.pool.query(query_lines, function (error, lines, fields) {
                    if (error) {
                      console.log(error);
                      res.sendStatus(400);
                    } else {
                      let linesMap = {};
                      for (let line of lines) {
                        let new_line = {};
                        for (const key in line) {
                          new_line.key = line[key];
                        }
                        linesMap[line.line_ID] = line;
                      }
                      let queryStations = `SELECT * FROM Stations ORDER BY location_name`;

                      db.pool.query(
                        queryStations,
                        function (error, stations, fields) {
                          for (let station of stations) {
                            station.line_name =
                              linesMap[station.line_code].line_name;
                            station.row_num =
                              linesMap[station.line_code].row_num;
                          }
                          res.send({
                            station: station,
                            stations: stations,
                          });
                        }
                      );
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});


app.post('/add_train_ajax', function(req, res) 
{
  let train = req.body;
  queryAddTrain = `INSERT INTO Trains (model, last_service_date, line_code) VALUES ('${train.model}', '${train.last_service_date}', '${train.line_code}');`;
  db.pool.query(queryAddTrain, function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      let queryTrains = `SELECT * FROM Trains;`;
      db.pool.query(queryTrains, function (error, trains, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          let queryLines = `SELECT line_name FROM \`Lines\` WHERE line_ID = ${train.line_code}`;
          db.pool.query(queryLines, function (error, lines, fields) {
            train.line_name = lines[0].line_name;
            
            let queryTrainID = `SELECT MAX(train_ID) AS train_ID from Trains`;
            db.pool.query(queryTrainID, function (error, rows, fields) {
              train.train_ID = rows[0].train_ID;
              let last_service_date = convertDatetime.convertDateToUTC(new Date(train.last_service_date));
              train.last_service_date_HTML = convertDatetime.convertDatetimeHTML(last_service_date);
              res.send({
                trains: trains,
                train: train,
              });
            });
          });
        }
      });
    }
  });
});


// DELETE ROUTES

app.delete('/delete_line_ajax/', function(req,res,next){
  let data = req.body;
  let lineID = parseInt(data.line_ID);
  let deleteLine= `DELETE FROM \`Lines\` WHERE line_ID = ?`;
  db.pool.query(deleteLine, [lineID], function(error, rows, fields){
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);    
      }
  })
});

app.delete('/delete_train_ajax/', function(req,res,next){
  let data = req.body;
  let trainID = parseInt(data.train_ID);
  let deleteSchedule = `DELETE FROM Schedules WHERE train_code = ?`;
  let deleteTrain= `DELETE FROM Trains WHERE train_ID = ?`;
  db.pool.query(deleteSchedule, [trainID], function(error, rows, fields){
    if (error) {
    console.log(error);
    res.sendStatus(400);
    } else {
      db.pool.query(deleteTrain, [trainID], function(error, rows, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          res.sendStatus(204);
        }
      })
    }
  })
});


app.delete('/delete_operator', function(req,res,next){
  let data = req.body;
  let operatorID = parseInt(data.operator_ID);
  let deleteOp = `DELETE FROM Operators WHERE operator_ID  = ?`;
  db.pool.query(deleteOp, [operatorID], function(error, rows, fields){
    if (error) {
    console.log(error);
    res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }  
  })
});


app.delete("/delete_station", function (req, res, next) {
  let station_ID = parseInt(req.body.station_ID);
  let queryDeleteStation = `DELETE FROM Stations WHERE station_ID=${station_ID}`;
  db.pool.query(
    queryDeleteStation,
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    }
  );
});


// PUT ROUTES

app.put('/put_line', function(req,res,next){                                   
  let data = req.body;
  let line_ID = parseInt(data.line_ID);
  let line_name = data.line_name;

  const queryUpdateLine = `UPDATE \`Lines\` SET line_name=? WHERE \`Lines\`.line_ID = ?`;
  const selectLine = `SELECT * FROM \`Lines\` WHERE line_ID = ?`;

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
  let last_service_date = convertDatetime.convertDateToUTC(new Date(data.last_service_date));
  let line_code = parseInt(data.line_code);

  queryUpdateTrain = `UPDATE Trains SET model=?, last_service_date=?, line_code=? WHERE Trains.train_ID = ?` ;
  selectTrain = `SELECT * FROM Trains WHERE train_ID = ?`
  db.pool.query(queryUpdateTrain, [model, last_service_date, line_code, train_ID], function(error, rows, fields){
    if (error) {
    console.log(error);
    res.sendStatus(400);
    } else {
      db.pool.query(selectTrain, [train_ID], function(error, rows, fields) {
          if (error) {
              console.log(error);
              res.sendStatus(400);
          } else {
            let train = rows[0];
            let queryLines = `SELECT * FROM \`Lines\``;
            db.pool.query(queryLines, function(error, rows, fields) {
              let linesMap = {};
              for (line of rows) {
                let new_line = {};
                for (key in line) {
                  new_line[key] = line[key];
                }
                linesMap[line.line_ID] = line;
              }
            
              train.last_service_date_HTML =
                convertDatetime.convertDatetimeHTML(last_service_date);
              train.last_service_date =
                convertDatetime.convertDatetime(last_service_date);
              train.line_name = linesMap[train.line_code].line_name; 
              res.send({train: train});
            })
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

    let queryTrains = "SELECT * FROM Trains;";
    db.pool.query(queryTrains, (error, trainRows, fields) => {
      if (error) {
        console.log(error);
        res.sendStatus(400);
        } else {
          let trainMap = {};
        for (train of trainRows) {
          let newTrain = {};
          for (key in train) {
            newTrain.key = train[key];
          }
          trainMap[train.train_ID] = train;
        }

        queryUpdateOp = `UPDATE Operators SET first_name=?, last_name=?, phone_number=?, email = ?, train_code = ? WHERE Operators.operator_ID = ?`;
        selectOp = `SELECT * FROM Operators WHERE operator_id = ?`
        db.pool.query(queryUpdateOp, [first_name, last_name, phone_number, email, train_code, operator_ID], function(error, rows, fields){
          if (error) {
          console.log(error);
          res.sendStatus(400);
          } else {
            db.pool.query(selectOp, [operator_ID], function(error, rows, fields) {
              if (error) {
                  console.log(error);
                  res.sendStatus(400);
              } else {
                const queryAllOperators = `SELECT * FROM Operators`;
                db.pool.query(queryAllOperators, function(error, operators, fields) {
                  let operator = rows[0];
                  let currTrain = trainMap[operator.train_code];
                  operator.train_name = `${currTrain.train_ID} - ${currTrain.model}`;
                  res.send({
                    operator: operator,
                    operators: operators
                  });
                })
              }
            })
          }
      })
    }
  })
});

app.put("/put_station", function (req, res, next) {
  let queryLines = `SELECT ROW_NUMBER() OVER (ORDER BY line_name) row_num, line_ID, line_name FROM \`Lines\` ORDER BY line_name`;
  db.pool.query(queryLines, function (error, rows, fields) {
    let lines = {};
    for (line of rows) {
      let new_line = {};
      for (key in line) {
        new_line[key] = line[key];
      }
      lines[new_line.line_ID] = new_line;
    }

    let data = req.body;
    let station_ID = parseInt(data.stationID);
    let location_name = data.stationName;
    let station_num = data.stationNum;
    let line_code = parseInt(data.lineID);

    let queryUpdateStation = `UPDATE Stations SET location_name=?, station_num=?, line_code=? WHERE station_ID=?`;
    db.pool.query(queryUpdateStation, [location_name, station_num, line_code, station_ID], function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      }
      else {
        let queryNewStation = `SELECT * FROM Stations WHERE station_ID=?`;
        db.pool.query(
          queryNewStation,
          [station_ID],
          function (error, rows, fields) {
            if (error) {
              console.log(error);
              res.sendStatus(400);
            } else {
              newStation = rows[0];
              newStation.line_name = lines[newStation.line_code].line_name;

              const queryAllStations = `SELECT * FROM Stations ORDER BY location_name`;
              db.pool.query(
                queryAllStations,
                function (error, stations, fields) {
                  for (station of stations) {
                    station.line_name = lines[station.line_code].line_name;
                    station.row_num = lines[station.line_code].row_num;
                  }
                  res.send({
                    newStation: newStation,
                    lines: lines,
                    stations: stations,
                  });
                }
              );
            }
          }
        );}
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


// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
var methodOverride = require('method-override')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
PORT        = 8451;                 // Set a port number at the top so it's easy to change in the future

// DATABASE
var db = require('./database/db-connector')

// HANDLEBARS
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
app.use(express.static('public'));

//Static Files
app.use(express.static('public'));
//app.use(express.static('views'));

// GET ROUTES
app.get('/', function(req, res)
    {
        res.render('index')
    });              

app.get('/index', function(req, res)
    {
        res.render('index');                   
    });      
    
app.get('/line_view', function(req, res)
    {
        res.render('line_view');
    });

app.get('/line_edit', function(req, res)
    {
        let query1 = "SELECT * FROM Lines;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('line_edit', {data: rows});
        })
    });

app.get('/line_edit', function(req, res)
    {
        res.render('line_edit');                    
    }); 


app.get('/line_template', function(req, res)
    {
        res.render('line_template');                    
    }); 

app.get("/operator_edit", function (req, res) {
  let query1 = "SELECT * FROM Operators;";
  db.pool.query(query1, function (error, rows, fields) {
    res.render("operator_edit", { data: rows });
  });
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
  });
});


app.post("/schedule_edit", function (req, res) {
  res.render("schedule_edit");
}); 

app.post("/station_edit", function (req, res) {
  res.render("station_edit");
}); 

app.get('/station_template', function(req, res)
    {
        res.render('station_template');                    
    }); 
    
app.get('/station_view', function(req, res)
    {
        res.render('station_view');                    
    }); 

app.post('/train_edit', function(req, res)
    {
        let query1 = "SELECT * FROM Trains;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('train_edit', {data: rows});
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
})

app.get('/lines_has_station', function(req, res)
    {
        res.render('lines_has_station');                    
    }); 

app.get('/relationship_template', function(req, res)
    {
        res.render('relationship_template');                    
    }); 

// POST ROUTES
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
})

// DELETE ROUTES
app.delete('/delete_operator', function(req,res,next){
    let data = req.body;
    let operatorID = parseInt(data.id);
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
    })

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
  })});


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});


// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended:true}))
PORT        = 8451;                 // Set a port number at the top so it's easy to change in the future

// Database
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

app.get('/line_template', function(req, res)
    {
        res.render('line_template');                    
    }); 

app.get('/operator_edit', function(req, res)
    {
        let query1 = "SELECT * FROM Operators;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('operator_edit', {data: rows});
        })
    }); 

app.get('/operator_template', function(req, res)
    {
        res.render('operator_template');                    
    }); 

app.get('/operator_view', function(req, res)
    {
        res.render('operator_view');                    
    }); 

app.get('/schedule_edit', function(req, res)
    {
        res.render('schedule_edit');                    
    }); 

app.get('/station_edit', function(req, res)
    {
        let query1 = "SELECT * FROM Stations;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('station_edit', {data: rows});
        })
    });

app.get('/station_template', function(req, res)
    {
        res.render('station_template');                    
    }); 
    
app.get('/station_view', function(req, res)
    {
        res.render('station_view');                    
    }); 

app.get('/train_edit', function(req, res)
    {
        let query1 = "SELECT * FROM Trains;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('train_edit', {data: rows});
        })
    });

app.get('/train_template', function(req, res)
    {
        res.render('train_template');                    
    }); 

app.get('/train_view', function(req, res)
    {
        res.render('train_view');                    
    }); 

app.get('/lines_has_station', function(req, res)
    {
        res.render('lines_has_station');                    
    }); 

app.get('/relationship_template', function(req, res)
    {
        res.render('relationship_template');                    
    }); 

<<<<<<< HEAD
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
            res.redirect('/');
        }
    })
})


app.delete('/delete_operator/', function(req,res,next){
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
=======
>>>>>>> 664815e9f44186bf06eec4e16e074c81d570bcfc


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
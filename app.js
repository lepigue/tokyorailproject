// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
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

app.get('/', function(req, res)
    {
        res.render('index');                   
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
        res.render('line_edit');                    
    }); 

app.get('/line_template', function(req, res)
    {
        res.render('line_template');                    
    }); 

app.get('/operator_edit', function(req, res)
    {
        res.render('operator_edit');                    
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
        res.render('station_edit');                    
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
        res.render('train_edit');                    
    }); 

app.get('/train_template', function(req, res)
    {
        res.render('train_template');                    
    }); 

app.get('/train_view', function(req, res)
    {
        res.render('train_view');                    
    }); 


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
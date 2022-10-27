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

// app.js

app.get('/', function(req, res)
    {
        res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });               

app.get('/stations', function(req, res)
    {
        res.render('stations');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });               

app.get('/lines', function(req, res)
    {
        res.render('lines');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });  
       
app.get('/operators', function(req, res)
    {
        res.render('operators');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    }); 

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
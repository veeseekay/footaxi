var express = require('express');
var bodyParser = require("body-parser");
var Client = require('node-rest-client').Client;

client = new Client();

// Set up Express environment and enable it to read and write JavaScript
var app = express();
// create application/json parser
var jsonParser = bodyParser.json()

// Controllers (route handlers).
var homeController = require('./controllers/home');
var ridesController = require('./controllers/rides');
//var userController = require('./controllers/user');

/**
 * Primary app routes.
 */
app.get('/', homeController.index);

// POST params - src, dest
app.post('/v1/rides/estimate', jsonParser, ridesController.estimate);

// POST book a taxi
// HEADER - api-key, user-digits, BODY = src,dest,time,passengers
app.post('/v1/rides', jsonParser, ridesController.createRide);

// GET taxi details
// HEADER - api-key, user-digits
app.get('/v1/rides/:ride_id', jsonParser, ridesController.getRide);

// POST ride feedback
// HEADER - api-key, user-digits, BODY = stars
app.post('/v1/rides/:ride_id/feedback', jsonParser, ridesController.feedback);

// Listen for requests until the server is stopped
app.listen(9000);
console.log('Listening on port 9000');

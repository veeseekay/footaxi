var express = require('express');
var bodyParser = require("body-parser");
var Client = require('node-rest-client').Client;
client = new Client();

// Set up Express environment and enable it to read and write JavaScript
var app = express();
// create application/json parser
var jsonParser = bodyParser.json()

// The API starts here
// GET /

var rootTemplate = {
  'footaxi': { 'href': './v1' }
};

app.get('/', function(req, resp) {
    resp.jsonp(rootTemplate);
});

// POST params - src, dest
app.post('/v1/rides/estimate', jsonParser, function(req, res) {

    if (!req.body) return res.sendStatus(400);
    console.log(req.body);

    if (!req.is('json')) {
      res.jsonp(400, {error: 'Bad request'});
      return;
    }

    console.log(req.body.src);
    console.log(req.body.dest);
    computeDist(req, res, req.body.src, req.body.dest);
});

function computeDist(req, res, src, dest) {
      var url = 'http://maps.googleapis.com/maps/api/distancematrix/json?';
      url += 'origins=' + src;
      url += '&destinations=' + dest;

      console.log("url --> " + url);

      client.get(url, function(data, response){
          var googResp = JSON.parse(data);
          //console.log("data ->> " + googResp);
          console.log("data ->> " + googResp.destination_addresses);
          var source_address = googResp.origin_addresses;
          var destination_address = googResp.destination_addresses;

          for (var i=0; i<1; i++){
              //console.log(googResp['rows'][i]);
              for (var j=0; j<1; j++){
                  //console.log(googResp['rows'][i]['elements'][j]);
                  var element = googResp['rows'][i]['elements'][j];
                  console.log(element.distance.value);
                  console.log(element.duration.value);
                  var distance = Number(element.distance.value);
                  var duration = Number(element.duration.value);
                  computeFare(req, res, source_address, destination_address, distance, duration);

              }
          }
      });
}

function computeFare(req, res, src, dest, distance, duration) {
    var pricePerFifthKm = 0.50;
    var fare = (distance * pricePerFifthKm * 5)/1000;
    var response = {
        'source_address' : src,
        'destination_address' : dest,
        'distance':distance,
        'duration':duration,
        'fare':"$ "+ fare
    }

    res.jsonp(response);
}

// POST book a taxi
// HEADER - api-key, user-digits, BODY = src,dest,time,passengers
app.post('/v1/rides', jsonParser, function(req, res) {

    if (!req.body) return res.sendStatus(400);
    console.log(req.body);

    if (!req.is('json')) {
      res.jsonp(400, {error: 'Bad request'});
      return;
    }

    var response = {
       "status": "accepted",
       "driver": {
          "phone_number": "(555)555-5555",
          "rating": 5,
          "name": "Bob"
       },
       "eta": 4,
       "location": {
          "latitude": 37.776033,
          "longitude": -122.418143,
       },
       "vehicle": {
          "make": "Bugatti",
          "model": "Veyron",
          "license_plate": "FOOTAXI",
       },
       "ride_id": "b2205127-a334-4df4-b1ba-fc9f28f56c96"
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(response));
});

// GET taxi details
// HEADER - api-key, user-digits
app.get('/v1/rides/:ride_id', jsonParser, function(req, res) {
    // gets the value for the named parameter ride_id from the url
    var ride_id = req.params.ride_id;
    console.log(ride_id);

    var response = {
       "status": "accepted",
       "driver": {
          "phone_number": "(555)555-5555",
          "rating": 5,
          "name": "Bob"
       },
       "eta": 4,
       "location": {
          "latitude": 37.776033,
          "longitude": -122.418143,
       },
       "vehicle": {
          "make": "Bugatti",
          "model": "Veyron",
          "license_plate": "FOOTAXI",
       },
       "ride_id": "b2205127-a334-4df4-b1ba-fc9f28f56c96"
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(response));
});

// POST ride feedback
// HEADER - api-key, user-digits, BODY = stars
app.post('/v1/rides/:ride_id/feedback', jsonParser, function (req, res) {

  if (!req.body) return res.sendStatus(400);
  console.log(req.body);

  if (req.body.stars === undefined) {
    res.jsonp(400, {error: 'Bad request' });
    return;
  }

  var response = {
    'stars': req.body.stars,
    'message': 'Thanks for rating your ride'
  };

  res.send(response);
});

// Listen for requests until the server is stopped
app.listen(9000);
console.log('Listening on port 9000');

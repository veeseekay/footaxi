
exports.index = function(req, res) {
  // noop here
}

exports.estimate = function(req, res) {

    if (!req.body) return res.sendStatus(400);
    console.log(req.body);

    if (!req.is('json')) {
      res.jsonp(400, {error: 'Bad request'});
      return;
    }

    console.log(req.body.src);
    console.log(req.body.dest);
    computeDist(req, res, req.body.src, req.body.dest);
}

function computeDist(req, res, src, dest) {
      var url = 'http://maps.googleapis.com/maps/api/distancematrix/json?';
      url += 'origins=' + src;
      url += '&destinations=' + dest;
      console.log("distancematrix url : " + url);

      client.get(url, function(data, response){
          var googResp = JSON.parse(data);
          //console.log("data ->> " + googResp);
          console.log("data ->> " + googResp.destination_addresses);
          var source_address = googResp.origin_addresses;
          var destination_address = googResp.destination_addresses;

          // we only care about the element [0,0] in the matrix
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
    var pricePerFifthKm = 3.0;
    var fare = (distance * pricePerFifthKm * 5)/1000;
    var response = {
        'source_address' : src,
        'destination_address' : dest,
        'distance':distance,
        'duration':duration,
        'fare':"Rs "+ Math.round(fare * 100) / 100
    }
    res.jsonp(response);
}

exports.createRide = function(req, res) {

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
}

exports.getRide = function(req, res) {
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
}

exports.feedback = function (req, res) {

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
}

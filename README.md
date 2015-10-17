# Footaxi Apigee Node.js

A simple API built using Express that simulats a taxi service's basic operations. Uses google geocoding & distance matrix to compute fares.

# To deploy:
    npm install
    apigeetool deploynodeapp -u USERNAME -p PASSWORD \
      -o ORG -e test -n footaxi -d .
      -m server.js -b /footaxi

Where:
* USERNAME: Your Apigee user name
* PASSWORD: Your Apigee password
* ORG: Your Apigee organization name

# To use:
    curl -X POST 
    -d '{"src":"indiranangar,bangalore","dest":"yelahanka"}' 
    http://[ORG]-test.apigee.net/footaxi/v1/rides/estimate 
    --header "Content-Type:application/json"

# Postman collections:
https://www.getpostman.com/collections/8885a957964e541d317a

# TODO
* Error scenarios
* Tests

require("dotenv").config();
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Balance = require('./api/models/balanc3AccBalanceModel'), //created model loading here
  Transaction = require('./api/models/balanc3TxnModel'), //created model loading here
  IntTransaction = require('./api/models/balanc3IntTxnModel'), //created model loading here
  bodyParser = require('body-parser');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tododb'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var site_route = require('./api/routes/balanc3Routes')(); //importing route
app.use('/', site_route.get_router()); //register the route

app.listen(port);

console.log('balanc3 RESTful API server started on: ' + port);
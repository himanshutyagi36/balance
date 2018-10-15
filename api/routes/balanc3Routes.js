'use strict';
var express = require('express');
var site_route = {};

module.exports = function() {
  var balanc3 = require('../controllers/balanc3Controller');
  var router = express.Router();

  router.route('/').get(function (req, res) {
    res.redirect('/home');
  });

  site_route.get_router = function() {
		return router;
  };

  router.post('/address/:account_address',balanc3.postData);
  router.get('/api/normaltransaction',balanc3.getNormalTxnData);
  router.get('/api/internaltransaction',balanc3.getInternalTxnData);
  router.get('/api/balance',balanc3.getBalanceData);

  return site_route;
};


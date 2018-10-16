'use strict';
'use strict'
const axios = require('axios');
const logger = require('../../utils/logger');
const helper = require('../../helpers/queryEtherscanHelper');
const controllerHelper = require('../../helpers/balanc3ControllerHelper');
const actions = require('../../utils/Actions');
var mongoose = require('mongoose'),
  Balance = mongoose.model('Balance'),
  Transaction = mongoose.model('Transaction'),
  IntTransaction = mongoose.model('IntTransaction');

const queryParameters = ["address", "from", "hash"];
/**
 * 
 * @param {object} req request object from api
 * @param {object} res response object to be returned as result
 * This function is responsible to populate the database
 */
function postData(req,res) {
  const address = req.params.account_address;
  var flag1 = getBalanceFromApi(address, actions.BALANCE);
  var flag2 = getTransactionFromApi(address, actions.TXLIST);
  var flag3 = getIntTransactionFromApi(address, actions.TXLISTINTERNAL);
  // Check if one of the internal process to populate db failed
  if ( flag1 || flag2 || flag3) {
    return res.status(500).send("Internal server error");
  } else {
    return res.status(200).send("Data storage started");
  }
}

/**
 * 
 * @param {string} address address to be queried on etherscan api
 * @param {string} action action parameter to be sent to etherscan api
 * This function gets the account balance from etherscan api. The address
 * and action are provided as a parameter.
 */
function getBalanceFromApi (address, action) {
  var account_address = address;
  var action = action;
  helper.queryEtherscanNew(address, action).then(() => {
    return false;
  },(err) => {
    console.log(err);
    // logger.error(err);
    return true;
  });
}

/**
 * 
 * @param {string} address address to be queried on etherscan api
 * @param {string} action action parameter to be sent to etherscan api
 * This function gets the normal transactions associated
 * with an address from etherscan api. The address
 * and action are provided as a parameter.
 */
function getTransactionFromApi(address,action) {
  var account_address = address;
  var action = action;
  helper.queryEtherscanNew(address, action).then(() => {
    return false;
  },(err) => {
    console.log(err);
    // logger.error(err);
    return true;
  });
}

/**
 * 
 * @param {string} address address to be queried on etherscan api
 * @param {string} action action parameter to be sent to etherscan api
 * This function gets the internal transactions associated
 * with an address from etherscan api. The address
 * and action are provided as a parameter.
 */
function getIntTransactionFromApi(address,action) {
  var account_address = address;
  var action = action;
  helper.queryEtherscanNew(address, action).then(() => {
    return false;
  },(err) => {
    console.log(err);
    // logger.error(err);
    return true;
  });
}
/**
 * 
 * @param {object} req request object from api call
 * @param {object} res response object to api query
 * This function caters to the api query on "/normaltransaction" endpoint.
 * If no parameter is provided, return all normal transactions
 * else if address is provided, return all normal transactions of that address
 * else if from (address) is provided, return all normal transactions of that address
 * else if to (address) is provided, return all normal transactions of that address
 * else if hash is provided, return normal transaction of that hash value
 * else a wrong parameter is provided, return relevant error message
 */
function getNormalTxnData(req,res) {
  var responseData;
  logger.debug("Getting normal transaction data...");
  if (Object.keys(req.query).length == 0) {
    var query = {};
    controllerHelper.queryNormalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      console.log(err)
      // logger.error(err);
      responseData = {
        message: err
      };
      res.status(500).send(responseData);
    });
  } else if (req.query.address != null) {
    logger.debug(`Getting normal txn data for address: ${req.query.address}`);
    var query = {
      contractAddress: req.query.address.toString()
    };
    controllerHelper.queryNormalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      console.log(err);
      // logger.error(err);
      responseData = {
        message: err
      };
      res.status(500).send(responseData);
    });
  } else if (req.query.from != null) {
    logger.debug(`Getting normal txn data from: ${req.query.from}`);
    var query = {
      from: req.query.from.toString()
    };
    controllerHelper.queryNormalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      console.log(err);
      // logger.error(err);
      responseData = {
        message: err
      };
      res.status(500).send(responseData);
    });
  } else if (req.query.to != null) {
    logger.debug(`Getting normal txn data to: ${req.query.to}`);
    var query = {
      to: req.query.to.toString()
    };
    controllerHelper.queryNormalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      console.log(err);
      // logger.error(err);
      responseData = {
        message: err
      };
      res.status(500).send(responseData);
    });
  } else if (req.query.hash != null) {
    logger.debug(`Getting normal txn data for hash: ${req.query.hash}`);
    var query = {
      hash: req.query.hash.toString()
    };
    controllerHelper.queryNormalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      console.log(err);
      // logger.error(err);
      responseData = {
        message: err
      };
      res.status(500).send(responseData);
    });
  } else {
    responseData = {
      message: "Unidentified query parameter in URL"
    };
    res.status(500).send(responseData);
  }
}

/**
 * 
 * @param {string} req request object from api call
 * @param {object} res response object to api query
 * This function caters to the api query on "/internaltransaction" endpoint.
 * If no parameter is provided, return all internal transactions
 * else if address is provided, return all internal transactions of that address
 * else if from (address) is provided, return all internal transactions of that address
 * else if to (address) is provided, return all internal transactions of that address
 * else if hash is provided, return normal transaction of that hash value
 * else a wrong parameter is provided, return relevant error message
 */
function getInternalTxnData(req,res) {
  var responseData;
  logger.debug("Getting internal transaction data...");
  if (Object.keys(req.query).length == 0) {
    var query = {};
    controllerHelper.queryInternalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      console.log(err);
      // logger.error(err);
      responseData = {
        message: err
      };
      res.status(500).send(responseData);
    });
  } else if (req.query.address != null) {
    logger.debug(`Getting internal txn data for address: ${req.query.address}`);
    var query = {
      contractAddress: req.query.address.toString()
    };
    controllerHelper.queryInternalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      console.log(err);
      // logger.error(err);
      responseData = {
        message: err
      };
      res.status(500).send(responseData);
    });
  } else if (req.query.from != null) {
    logger.debug(`Getting internal txn data from: ${req.query.from}`);
    var query = {
      from: req.query.from.toString()
    };
    controllerHelper.queryInternalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      console.log(err);
      // logger.error(err);
      responseData = {
        message: err
      };
      res.status(500).send(responseData);
    });
  } else if (req.query.to != null) {
    logger.debug(`Getting internal txn data to: ${req.query.to}`);
    var query = {
      to: req.query.to.toString()
    };
    controllerHelper.queryInternalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      console.log(err);
      // logger.error(err);
      responseData = {
        message: err
      };
      res.status(500).send(responseData);
    });
  } else if (req.query.hash != null) {
    logger.debug(`Getting normal txn data for hash: ${req.query.hash}`);
    var query = {
      hash: req.query.hash.toString()
    };
    controllerHelper.queryNormalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      console.log(err);
      // logger.error(err);
      responseData = {
        message: err
      };
      res.status(500).send(responseData);
    });
  } else {
    responseData = {
      message: "Unidentified query parameter in URL"
    };
    res.status(500).send(responseData);
  }
}


/**
 * 
 * @param {object} req request object from api call
 * @param {object} res response object to api query
 * This function caters to the api query on "/balance" endpoint.
 * If no parameter is provided, return all balances and corresponding address
 * If address is provided, return balance of that address
 * If a wrong parameter is provided, return relevant error message
 */
function getBalanceData(req,res) {
  var responseData;
  logger.debug("Getting balance data...");
  if (Object.keys(req.query).length == 0) {
    var query = {};
    controllerHelper.queryBalanceAll(query).then((results) => {
      responseData = {
        account_address: results[0]._id,
        account_balance: results[0].account_balance
      };
      res.status(200).send(responseData);
    }, (err) => {
      console.log(err);
      // logger.error(err);
      responseData = {
        message: err
      };
      res.status(500).send(responseData);
    });
  } else if (req.query.address != null) {
    logger.debug(`Getting balance for address: ${req.query.address}`);
    var query = {
      _id: req.query.address.toString()
    };
    controllerHelper.queryBalanceAddress(query).then((results) => {
      res.status(200).send(results);
    }, (err) => {
      console.log(err);
      // logger.error(err);
      responseData = {
        message: err
      };
      res.status(500).send(responseData);
    });
  } else {
    responseData = {
      message: "Unidentified query parameter in URL"
    };
    res.status(500).send(responseData);
  }
}

module.exports = {
  postData,
  getNormalTxnData,
  getInternalTxnData,
  getBalanceData
}
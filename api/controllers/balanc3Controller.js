'use strict';
'use strict'
const axios = require('axios');
const logger = require('../../utils/logger');
const helper = require('../../utils/helper');
const actions = require('../../utils/Actions');
var mongoose = require('mongoose'),
  Balance = mongoose.model('Balance'),
  Transaction = mongoose.model('Transaction'),
  IntTransaction = mongoose.model('IntTransaction');

const queryParameters = ["address", "from", "hash"];
/**
 * 
 * @param {*} req 
 * @param {*} res 
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
 * @param {address to be queried on etherscan api} address 
 * @param {action parameter to be sent to etherscan api} action 
 * This function gets the account balance from etherscan api. The address
 * and action are provided as a parameter.
 */
function getBalanceFromApi (address, action) {
  var account_address = address;
  var action = action;
  helper.queryEtherscan(address, action).then(() => {
    return false;
  },(err) => {
    logger.error(err);
    return true;
  });
}

/**
 * 
 * @param {address to be queried on etherscan api} address 
 * @param {action parameter to be sent to etherscan api} action 
 * This function gets the normal transactions associated
 * with an address from etherscan api. The address
 * and action are provided as a parameter.
 */
function getTransactionFromApi(address,action) {
  var account_address = address;
  var action = action;
  helper.queryEtherscan(address, action).then(() => {
    return false;
  },(err) => {
    logger.error(err);
    return true;
  });
}

/**
 * 
 * @param {address to be queried on etherscan api} address 
 * @param {action parameter to be sent to etherscan api} action 
 * This function gets the internal transactions associated
 * with an address from etherscan api. The address
 * and action are provided as a parameter.
 */
function getIntTransactionFromApi(address,action) {
  var account_address = address;
  var action = action;
  helper.queryEtherscan(address, action).then(() => {
    return false;
  },(err) => {
    logger.error(err);
    return true;
  });
}
/**
 * 
 * @param {request object from api call} req 
 * @param {response object to api query} res 
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
    helper.queryNormalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      logger.error(err);
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
    helper.queryNormalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      logger.error(err);
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
    helper.queryNormalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      logger.error(err);
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
    helper.queryNormalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      logger.error(err);
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
    helper.queryNormalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      logger.error(err);
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
 * @param {request object from api call} req 
 * @param {response object to api query} res 
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
    helper.queryInternalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      logger.error(err);
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
    helper.queryInternalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      logger.error(err);
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
    helper.queryInternalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      logger.error(err);
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
    helper.queryInternalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      logger.error(err);
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
    helper.queryNormalTxn(query).then((results) => {
      responseData = {
        message: results
      };
      res.status(200).send(responseData);
    }, (err) => {
      logger.error(err);
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
 * @param {request object from api call} req 
 * @param {response object to api query} res 
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
    helper.queryBalanceAll(query).then((results) => {
      responseData = {
        account_address: results[0]._id,
        account_balance: results[0].account_balance
      };
      res.status(200).send(responseData);
    }, (err) => {
      logger.error(err);
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
    helper.queryBalanceAddress(query).then((results) => {
      // responseData = {
      //   account_address: results[0]._id,
      //   account_balance: results[0].account_balance,
      // };
      res.status(200).send(results);
    }, (err) => {
      logger.error(err);
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
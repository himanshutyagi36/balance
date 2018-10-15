'use strict'

const Balance = require('../api/models/balanc3AccBalanceModel');
const Transaction = require('../api/models/balanc3TxnModel');
const IntTransaction = require('../api/models/balanc3IntTxnModel');
const logger = require('./logger');
const axios = require('axios');
const actions = require('./Actions');

/**
 * 
 * @param {account address in consideration} account_address 
 * @param {balance returned from etherscan api} account_balance 
 * Helper function to create an entry if it does not exist, update if an entry already exists
 * in the balance collection.
 */
async function saveBalance(account_address, account_balance) {
  logger.info(`[saveBalance] Saving/updating the balance for account: ${account_address}`);
  return Balance.updateOne({_id: account_address}, { $set: { account_balance: account_balance }}, {upsert: true, setDefaultsOnInsert: true}).then();
}

/**
 * 
 * @param {account address in consideration} account_address 
 * @param {list of transactions returned from the etherscan api} txlist 
 * Helper function to insert/update normal transactions of an address into the transactions collection.
 * I update the document with "hash" already exists, or create a new one if no document with the "hash" 
 * value exists.
 * 
 */
async function saveTransaction(account_address, txList) {
  logger.info(`[saveTransaction] Saving normal transactions for account: ${account_address}`);
  for(var i=0;i<txList.length;i+=1) {
    var query = {
      hash: txList[i]['hash'].toString()
    }
    Transaction.findOneAndUpdate(query, txList[i], {upsert: true, new: true, runValidators: true},
      function(err, doc) {
        if (err) {
          logger.error('****'+err);
          return
      } else {
          return
      }
      });
      
  }
  
}

/**
 * 
 * @param {account address in consideration} account_address 
 * @param {list of internal transactions returned from the etherscan api} account_balance 
 * Helper function to bulk insertinternal transactions of an address into the inttransactions collection.
 * I update the document with "hash" already exists, or create a new one if no document with the "hash" 
 * value exists.
 */
async function saveIntTransaction(account_address, txList) {
  logger.info(`[saveTransaction] Saving internal transactions for account: ${account_address}`);
  for(var i=0;i<txList.length;i+=1) {
    var query = {
      hash: txList[i]['hash'].toString()
    }
    IntTransaction.findOneAndUpdate(query, txList[i], {upsert: true, new: true, runValidators: true},
      function(err, doc) {
        if (err) {
          logger.error('****'+err);
          return
      } else {
          return
      }
      });
      
  }
}

/**
 * 
 * @param {account address in consideration} account_address 
 * @param {the relevant action to query the etherscan api} action 
 * This function makes api calls to the etherscan api. We query three different endpoints on etherscan.
 * Firstly, I create the api url based on the "action" specified. Action can take three values.
 * These values are defined in the /utils/Actions.js file. Once the api query returns,
 * I use the switch-case on action, to determine the appropriate function to be called to save data
 * to the database.
 */
async function queryEtherscan(account_address, action) {
  var apiUrlBal = `${process.env.API_URL}&action=${action}&address=${account_address}&tag=latest&apikey=${process.env.API_KEY_TOKEN}`;
  var apiUrlTxNormal = `${process.env.API_URL}&action=${action}&address=${account_address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.API_KEY_TOKEN}`
  var apiUrlTxInternal = `${process.env.API_URL}&action=${action}&address=${account_address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.API_KEY_TOKEN}`
  return new Promise(function(resolve,reject){
    var apiUrl;
    if (action == actions.BALANCE)
      apiUrl = apiUrlBal;
    else if (apiUrl == actions.TXLIST)
      apiUrl = apiUrlTxNormal;
    else
      apiUrl = apiUrlTxInternal;
    axios.get(apiUrl)
    .then(async function(response) {
      if (response.data.status == 1) {
        try {
          switch(action) {
            case actions.BALANCE:
            await saveBalance(account_address, response.data.result);
            break;
            case actions.TXLIST:
            logger.info("# of normal transaction: "+response.data.result.length);
            await saveTransaction(account_address, response.data.result);
            break;
            case actions.TXLISTINTERNAL:
            logger.info("# of internal transaction: "+response.data.result.length);
            await saveIntTransaction(account_address, response.data.result);
            break;
          }        
        } catch (err) {
          logger.error(err);
          reject(err);
        }
        resolve();
      }
      
    })
    .catch(error => {
      logger.error(error);
      reject(err);
    });
  })  
}

/**
 * 
 * @param {query to be done on the db} query 
 * This function takes in query parameter and gets the normal transactions from the database and
 * returns a promise accordingly.
 */
function queryNormalTxn(query) {
  return new Promise(function (resolve, reject) {
    Transaction.find(query,'-__v').exec(function(err, results) {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });    
  });
}

/**
 * 
 * @param {query to be done on the db} query 
 * This function takes in query parameter and gets the internal transactions from the database and
 * returns a promise accordingly.
 */
function queryInternalTxn(query) {
  return new Promise(function (resolve, reject) {
    IntTransaction.find(query,'-__v').exec(function(err, results) {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });    
  });
}

/**
 * 
 * @param {address to be queried} address 
 * Called from queryBalanceAddress()
 * This function takes in an account address as parameter and return the number of nomal txn 
 * received by it.
 */
function toCountNormal(address) {
  return new Promise(function(resolve,reject) {
    var toCountNormal;
    var fromCountNormal;
    var res = {};
    Transaction.count({to: address}, function(err,count){
      if (!err) {
        // console.log('tcn'+count);
        resolve(count);
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}

/**
 * 
 * @param {address to be queried} address 
 * Called from queryBalanceAddress()
 * This function takes in an account address as parameter and return the number of normal txn 
 * originated from it.
 */
function fromCountNormal(address) {
  return new Promise(function(resolve,reject) {
    var toCountNormal;
    var fromCountNormal;
    var res = {};
    Transaction.count({from: address}, function(err,count){
      if (!err) {
        // console.log('fcn'+count);
        resolve(count);
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}

/**
 * 
 * @param {address to be queried} address 
 * Called from queryBalanceAddress()
 * This function takes in an account address as parameter and return the number of internal txn 
 * received by it.
 */
function toCountInternal(address) {
  return new Promise(function(resolve,reject) {
    var toCountInternal;
    var fromCountInternal;
    var res = {};
    IntTransaction.count({to: address}, function(err,count){
      if (!err) {
        // console.log('tci'+count);
        resolve(count);
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}

/**
 * 
 * @param {address to be queried} address 
 * Called from queryBalanceAddress()
 * This function takes in an account address as parameter and return the number of internal txn 
 * originated from it.
 */
function fromCountInternal(address) {
  return new Promise(function(resolve,reject) {
    var toCountInternal;
    var fromCountInternal;
    var res = {};
    IntTransaction.count({from: address}, function(err,count){
      if (!err) {
        // console.log('fci'+count);
        resolve(count);
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}
/**
 * 
 * @param {query to be done on the db} query 
 * This function takes in query parameter and gets the balance of associated address from the database and
 * returns a promise accordingly.
 */
function queryBalanceAddress(query) {
  var acc_address = query['_id'];
  var var1="";
  var var2="";
  var var3="";
  var var4="";
  var returnRes = {};
  return new Promise(function (resolve, reject) {
    Balance.find(query).exec(async function(err, results) {
      if (!err) { 
        try {
          var1 = await toCountNormal(acc_address);
          var2 = await fromCountNormal(acc_address);
          var3 = await toCountInternal(acc_address);
          var4 = await fromCountInternal(acc_address);
        } catch(e) {
          console.log(e);
          logger.error(e);
        }
        returnRes['account_address'] = results[0]._id;
        returnRes['account_balance'] = results[0].account_balance;
        returnRes['# of normal txn to this address:'] = var1;
        returnRes['# of normal txn from this address:'] = var2;
        returnRes['# of internal txn to this address:'] = var3;
        returnRes['# of internal txn from this address:'] = var4;
        // console.log(returnRes);
        resolve(returnRes);
      } else {
        reject(err);
      }
    });    
  });
}

/**
 * 
 * @param {*} query 
 * This helper function gets all balances and addresses stored in the collection.
 */
function queryBalanceAll(query) {
  return new Promise(function (resolve, reject) {
    Balance.find(query).exec(function(err, results) {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });    
  });
}
module.exports = {
  queryEtherscan,
  queryNormalTxn,
  queryInternalTxn,
  queryBalanceAddress,
  queryBalanceAll
}
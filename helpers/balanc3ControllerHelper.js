'use strict'

const Balance = require('../api/models/balanc3AccBalanceModel');
const Transaction = require('../api/models/balanc3TxnModel');
const IntTransaction = require('../api/models/balanc3IntTxnModel');
const logger = require('../utils/logger');
const axios = require('axios');
const actions = require('../utils/Actions');

/**
 * 
 * @param {object} query query to be done on the db
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
 * @param {object} query query to be done on the db
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
 * @param {string} address address to be queried
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
 * @param {string} address address to be queried
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
 * @param {string} address address to be queried
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
 * @param {string} address address to be queried
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
 * @param {object} query query to be done on the db
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
            // logger.error(e);
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
 * @param {object} query query to be done on the db
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
    queryNormalTxn,
    queryInternalTxn,
    queryBalanceAddress,
    queryBalanceAll
}
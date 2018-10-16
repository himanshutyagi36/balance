'use strict'

const Balance = require('../api/models/balanc3AccBalanceModel');
const Transaction = require('../api/models/balanc3TxnModel');
const IntTransaction = require('../api/models/balanc3IntTxnModel');
const logger = require('../utils/logger');
const axios = require('axios');
const actions = require('../utils/Actions');

/**
 * 
 * @param {string} account_address account address in consideration
 * @param {string} account_balance balance returned from etherscan api
 * Helper function to create an entry if it does not exist, update if an entry already exists
 * in the balance collection.
 */
async function saveBalance(account_address, account_balance) {
  logger.info(`[saveBalance] Saving/updating the balance for account: ${account_address}`);
  return Balance.updateOne({_id: account_address}, { $set: { account_balance: account_balance }}, {upsert: true, setDefaultsOnInsert: true}).then();
}

/**
 * 
 * @param {string} account_address account address in consideration
 * @param {string} txlist list of transactions returned from the etherscan api
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
          logger.error(err);
          return
      } else {
          return
      }
      });
      
  }
  
}

/**
 * 
 * @param {string} account_address account address in consideration
 * @param {list} txList list of internal transactions returned from the etherscan api
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
          logger.error(err);
          return
      } else {
          return
      }
      });
      
  }
}

/**
 * THIS FUNCTION IS LEGACY CODE. NOT USED ANYMORE. queryEtherscanNew() is used now.
 * @param {string} account_address account address in consideration
 * @param {string} action the relevant action to query the etherscan api
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
 * @param {string} account_address account address in consideration
 * @param {string} action the relevant action to query the etherscan api
 */
async function queryEtherscanNew(account_address,action) {
  return new Promise(function(resolve,reject) {
    switch(action){
      case actions.BALANCE:
        axios.get(process.env.API_URL, {
          params: {
            action: action,
            address: account_address,
            tag: 'latest',
            apikey: process.env.API_KEY_TOKEN
          }
        })
        .then(async function(response) {
          if (response.data.status == 1) {
            logger.info("Saving balance data for: "+account_address);
            await saveBalance(account_address, response.data.result);
          } else {
            console.log("Not able to get balance data !!");
          }
        })
        .catch(error => {
          console.log(error);
          reject(err);
        });
        break;
      case actions.TXLIST:
        // console.log(action);
        axios.get(process.env.API_URL, {
          params: {
            action: action,
            address: account_address,
            startblock: '0',
            endblock: 'latest',
            sort: 'asc',
            apikey: process.env.API_KEY_TOKEN
          }
        })
        .then(async function(response) {
          if (response.data.status == 1) {
            logger.info("# of normal transaction: "+response.data.result.length);
            await saveTransaction(account_address, response.data.result);
          } else {
            console.log("Not able to get normal txn data !!");
            // logger.error("error");
          }        
        })
        .catch(error => {
          console.log(error);
          reject(err);
        });
        break;
      case actions.TXLISTINTERNAL:
        // console.log(action);
        axios.get(process.env.API_URL, {
          params: {
            action: action,
            address: account_address,
            startblock: '0',
            endblock: 'latest',
            sort: 'asc',
            apikey: process.env.API_KEY_TOKEN
          }
        })
        .then(async function(response) {
          if (response.data.status == 1) {
            logger.info("# of internal transaction: "+response.data.result.length);
            await saveIntTransaction(account_address, response.data.result);
          } else {
            console.log("Not able to get normal txn data !!");
            // logger.error("error");
          }    
        })
        .catch(error => {
          console.log(error);
          reject(err);
        });
        break;
    resolve();
    }
  });
}

module.exports = {
  queryEtherscan,
  queryEtherscanNew
}
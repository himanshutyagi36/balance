'use strict';

const mongoose = require('../../utils/dbConnection');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  blockNumber: {
    type: String,
    required: true
  },
  timeStamp: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  nonce: {
    type: String
  },
  blockHash: {
    type: String,
    required: true
  },
  transactionIndex: {
    type: String
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String
  },
  value: {
    type: String
  },
  gas: {
    type: String
  },
  isError: {
    type: String,
    required: true
  },
  txreceipt_status: {
    type: String
  },
  input: {
    type: String
  },
  contractAddress: {
    type: String
  },
  cumulativeGasUsed: {
    type: String
  },
  gasUsed: {
    type: String
  },
  confirmations: {
    type: String
  }
});

transactionSchema.index({hash: 1}, { unique: true });
module.exports = mongoose.db.model('Transaction', transactionSchema);
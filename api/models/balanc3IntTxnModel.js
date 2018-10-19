'use strict';

const mongoose = require('../../utils/dbConnection');
const Schema = mongoose.Schema;

const internalTransactionSchema = new Schema({
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
    required: true,
    unique:true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String
  },
  value: {
    type: String,
    required: true
  },
  contractAddress: {
    type: String
  },
  input: {
    type: String
  },
  type: {
    type: String,
    required: true
  },
  gas: {
    type: String,
    required: true
  },
  traceId: {
    type: String
  },
  isError: {
    type: String,
    required: true
  },
  gasUsed: {
    type: String
  },
  errCode: {
    type: String
  }
});

internalTransactionSchema.index({hash: 1});
module.exports = mongoose.db.model('IntTransaction', internalTransactionSchema);
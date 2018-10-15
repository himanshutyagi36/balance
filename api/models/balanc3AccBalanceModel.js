const mongoose = require('../../utils/dbConnection');
const Schema = mongoose.Schema;
const balanceSchema = new Schema({
    _id: {
      type: String,
      required: true
    },
    account_balance: {
      type: String,
      required: true
    }
  });

module.exports = mongoose.db.model('Balance', balanceSchema);
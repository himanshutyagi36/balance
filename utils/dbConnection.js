'use strict'

const mongoose = require('mongoose');
const logger = require('./logger');

mongoose.Promise = global.Promise;

var mongodb = process.env.DB_CONNECTION || `mongodb://localhost:27017/${process.env.DBNAME}`;
// Service Database
logger.info('Connecting to the Mongo DB: '+mongodb);
mongoose.connect(mongodb);

const db = mongoose.connection;
db.on('error', (err) => {
  logger.error('Error connecting to Mongo DB')
  logger.error(err)
});
db.once('open', () => {
  logger.info('Connection to API service DB ok!')
});

process.on('unhandledRejection', (err) => {
  logger.error(err)
});

mongoose.db = db;
module.exports = mongoose;
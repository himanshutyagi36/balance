//Setup logging
var winston = require('winston');
var logger = winston.createLogger({
	level: process.env.LOG_LEVEL,
	transports: [new(winston.transports.Console)({
		colorize: true,
		timestamp: true
	}), ]
});
module.exports = logger;
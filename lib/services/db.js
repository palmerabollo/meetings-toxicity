'use strict';

var path = require('path'),
	logger = require('./logger'),
	Datastore = require('nedb'),
	db = new Datastore({ filename: path.join(__dirname, 'scoring.db'), autoload: true });

db.ensureIndex({ fieldName: 'mail.messageId', unique: true }, function (err) {
	if (err) {
		logger.warn(err, 'Unable to ensure index on mail.messageId');
	}
});
module.exports = db;

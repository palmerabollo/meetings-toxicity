'use strict';

var path = require('path'),
	Datastore = require('nedb'),
	db = new Datastore({ filename: path.join(__dirname, 'scoring.db'), autoload: true });

db.ensureIndex({ fieldName: 'mail.messageId', unique: true }, function (err) {
	if (err) {
		console.warn('Unable to ensure index on mail.messageId', err);
	}
});
module.exports = db;

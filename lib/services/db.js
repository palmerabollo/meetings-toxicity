'use strict';

var path = require('path'),
	Datastore = require('nedb'),
	db = new Datastore({ filename: path.join(__dirname, 'scoring.db'), autoload: true });
	
module.exports = db;

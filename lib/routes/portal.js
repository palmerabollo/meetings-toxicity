'use strict';

var express = require('express'),
    db = require('../services/db');

function initializeRouter() {
  var router = express.Router();

  router.get('/', function home(req, res) {
    res.render('index');
  });

  router.get('/score/:messageId', function home(req, res, next) {
    db.findOne({'mail.messageId': req.params.messageId}, function (err, doc) {
      if (err) {
        return next(err);
      }
      
      if (!doc) {
        return next(new Error('Message not found'));
      }

      console.log(Object.keys(doc));
      res.render('score', doc);  
    });
  });
  
  router.all('*', function notFound(req, res, next) {
    next(new Error('Resource Not found'));
  });

  router.use(function errorHandler(err, req, res, next) {
    res.
      status(err.status || 500).
      render('error', {message: err.message});
  });

  return router;
}

module.exports = initializeRouter;

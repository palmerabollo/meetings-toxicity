'use strict';

var express = require('express'),
    favicon = require('serve-favicon'),
    less = require('less-middleware'),
    path = require('path'),
    ical = require('../services/ical'),
    db = require('../services/db');

function initializeRouter() {
  var router = express.Router();

  router.use(favicon(path.join(__dirname, '../..', 'public', 'favicon.svg')));
  router.use(less(path.join(__dirname, '../..', 'public')));
  router.use(express.static(path.join(__dirname, '../..', 'public')));

  router.get('/', function home(req, res) {
    res.render('index');
  });

  router.get('/report/:messageId', function home(req, res, next) {
    db.collection('messages').findOne({'mail.messageId': req.params.messageId}, function (err, doc) {
      if (err) {
        return next(err);
      }

      if (!doc) {
        return next(new Error('Message not found'));
      }

      var event = ical.event(doc.mail);
      if (!event) {
        return next(new Error('No ical event found'));
      }

      var model = {
        mail: doc.mail,
        score: doc.score,
        cost: doc.cost,
        event: event
      };

      res.render('report', model);
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

'use strict';

var express = require('express'),
    http = require('http'),
    swig = require('swig'),
    logger = require('./services/logger'),
    db = require('./services/db'),
    portal = require('./routes/portal');

function initializeApplication() {
  var app = express();

  app.set('view engine', 'swig');
  app.engine('swig', swig.renderFile);

  app.use('/', portal());

  var server = http.createServer(app);
  var port = process.env.PORT || 3210;
  var host = process.env.HOST || '0.0.0.0';

  server.listen(port, host, function () {
    logger.info(server.address(), 'scoring-app listening');

    // XXX imap reader should be an independent process
    require('./imap-reader-app');
  });
}

initializeApplication();

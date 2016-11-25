'use strict';

var notifier = require('mail-notifier'),
  nodemailer = require('nodemailer'),
  util = require('util'),
  path = require('path'),
  fs = require('fs'),
  swig = require('swig'),
  scoring = require('./services/scoring'),
  ical = require('./services/ical'),
  db = require('./services/db'),
  logger = require('./services/logger');

var imap = {
  user: process.env.IMAP_USER,
  password: process.env.IMAP_PASS,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

var notifier = notifier(imap);

function reply(mail, score, callback) {
  // reply to the sender (not the organizer) if possible !
  var from = mail.headers.sender || mail.from[0].address;

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.IMAP_USER,
      pass: process.env.IMAP_PASS
    }
  });

  var data = {
    mail: mail,
    score: score,
    public_endpoint: process.env.PUBLIC_ENDPOINT || 'meetingsaretoxic.com'
  };
  var html = swig.renderFile(path.join(__dirname, 'template.swig'), data);

  var mailOptions = {
    from: util.format('Meeting Scoring <%s>', process.env.IMAP_USER),
    to: from,
    subject: util.format('Meeting Toxicity: %d', score.toxicity),
    generateTextFromHTML: true,
    html: html,
    headers: {
      'X-Meeting-Toxicity': score.toxicity
    }
  };

  transporter.sendMail(mailOptions, callback);
}

notifier.on('mail', function (mail) {
  logger.info('got mail %s', mail.messageId);

  var event = ical.event(mail);
  if (!event) {
    logger.info('No ical event found');
    return;
  }
  var score = scoring.score(mail, event);
  var cost = scoring.cost(mail, event);

  db.get().collection('messages').update(
    { 'mail.messageId': mail.messageId },
    {
      mail: mail,
      score: score,
      cost: cost,
      timestamp: new Date()
    },
    { upsert: true },
    function (err, numReplaced, doc) {
      if (err) {
        logger.warn('not able to store document', err);
        return;
      }

      reply(mail, score, function onReply(err, info) {
        if (err) {
          logger.warn(err);
          return;
        }
        logger.info('Toxicity report sent:', score.toxicity, info.response);
      });
    });
});

notifier.on('end', function () { // keep it running forever
  notifier.start();
})

notifier.start();

'use strict';

var notifier = require('mail-notifier'),
  nodemailer = require('nodemailer'),
  util = require('util'),
  path = require('path'),
  fs = require('fs'),
  swig = require('swig'),
  scoring = require('./services/scoring'),
  ical = require('./services/ical'),
  db = require('./services/db');

var imap = {
  user: process.env.USER,
  password: process.env.PASS,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

var notifier = notifier(imap);

function reply(mail, score, callback) {
  var from = mail.from[0].address;

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  });

  var data = {
    mail: mail,
    score: score
  };
  var html = swig.renderFile(path.join(__dirname, 'template.swig'), data);

  var mailOptions = {
    from: util.format('Meeting Scoring <%s>', process.env.USER),
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
  console.log('got mail %s', mail.messageId);

  var event = ical.event(mail);
  if (!event) {
    console.log('No ical event found');
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
        console.warn('not able to store document', err);
        return;
      }

      reply(mail, score, function onReply(err, info) {
        if (err) {
          console.warn(err);
          return;
        }
        console.log('Toxicity report sent:', score.toxicity, info.response);
      });
    });
});

notifier.start();

'use strict';

var notifier = require('mail-notifier'),
  icalendar = require('icalendar'),
  nodemailer = require('nodemailer'),
  util = require('util'),
  _ = require('lodash'),
  path = require('path'),
  fs = require('fs'),
  swig = require('swig'),
  scoring = require('./services/scoring'),
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
    subject: util.format('Meeting Toxicity: %d%', score.toxicity),
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

  var attachment = _.find(mail.attachments, { contentType: 'text/calendar' });
  if (!attachment) {
    console.log('No ical attachment found');
    return;
  }

  var ical = icalendar.parse_calendar(attachment.content.toString());
  var icalEvent = ical.events()[0];
  var score = scoring.score(mail, icalEvent);
  
  db.update(
    { 'mail.messageId': mail.messageId },
    { mail: mail, score: score, timestamp: new Date() },
    { upsert: true },
    function (err, numReplaced, doc) {
      console.log('document stored in database %s', doc._id);
      
      reply(mail, score, function onReply(err, info) {
        if (err) {
          console.log(err);
          return;
        }
        console.log('Toxicity report sent:', score.toxicity, info.response);
      });
    });
});

notifier.start();

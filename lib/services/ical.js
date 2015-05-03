'use strict'

var _ = require('lodash'),
    icalendar = require('icalendar');

function event(mail) {
  var attachment = _.find(mail.attachments, { contentType: 'text/calendar' });
  if (!attachment) {
    console.log('No ical attachment found');
    return;
  }

  try {
    // var content = new Buffer(attachment.content).toString();
    var content = attachment.content.buffer.toString();
    var ical = icalendar.parse_calendar(content);
  } catch (e) {
    console.warn('Not able to parse ical', e);
    return;
  }

  return ical.events()[0];
}

module.exports = {
  event: event
};

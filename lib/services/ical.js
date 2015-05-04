'use strict'

var _ = require('lodash'),
    icalendar = require('icalendar');

function event(mail) {
  // outlook uses mail.alternatives, imail uses mail.attachments
  var calendars = _.union(mail.attachments, mail.alternatives);
  var attachment = _.find(calendars, { contentType: 'text/calendar' });

  if (!attachment) {
    console.log('No ical attachment/alternatives found');
    return;
  }

  try {
    // XXX ugly hack to handle mongodb buffers
    var content = attachment.content.buffer ?
                  attachment.content.buffer.toString() :
                  new Buffer(attachment.content).toString();

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

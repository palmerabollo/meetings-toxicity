'use strict'

var _ = require('lodash'),
    icalendar = require('icalendar'),
    logger = require('./logger');

function event(mail) {
  // outlook uses mail.alternatives, imail uses mail.attachments
  var calendars = _.union(mail.attachments, mail.alternatives);
  var attachment = _.find(calendars, { contentType: 'text/calendar' });

  if (!attachment) {
    logger.info('No text/calendar attachment/alternatives found');
  }

  attachment = _.find(calendars, { contentType: 'application/ics' });

  if (!attachment) {
    logger.info('No application/ics attachment/alternatives found either');
    return;
  }

  try {
    // XXX ugly hack to handle mongodb buffers
    var content = attachment.content.buffer ?
                  attachment.content.buffer.toString() :
                  new Buffer(attachment.content).toString();

    var ical = icalendar.parse_calendar(content);
  } catch (err) {
    logger.warn(err, 'Not able to parse ical');
    return;
  }

  return ical.events()[0];
}

module.exports = {
  event: event
};

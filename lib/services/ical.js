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
    attachment = _.find(calendars, { contentType: 'application/ics' });

    if (!attachment) {
      logger.info('No application/ics attachment/alternatives found either');
      return;
    }
  }

  try {

    // XXX super ugly hack, override content with a string, buffers are not well supported in nedb/mongo
    if (attachment.content.buffer) {
        logger.debug('Content buffer found');
        var content = new Buffer(attachment.content.buffer).toString();
    } else {
        var content = attachment.content;
    }

    content = content.substr(content.indexOf('BEGIN:VCALENDAR'));
    content = content.substring(0, content.indexOf('END:VCALENDAR') + 'END:VCALENDAR'.length);
    content = content + '\n';

    attachment.content = content;

    console.log(content);

    var ical = icalendar.parse_calendar(content);
  } catch (err) {
    logger.error(err, 'Not able to parse ical: ' + err.message);
    return;
  }

  return ical.events()[0];
}

module.exports = {
  event: event
};

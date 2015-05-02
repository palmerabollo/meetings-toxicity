'use strict';

var util = require('util'),
    _ = require('lodash');

function score(mail, event) {
  var from = mail.from[0].address;
  
  /**
  console.log('from: %s', from);
  console.log('priority: %s', mail.priority);

  console.log(event.getPropertyValue('ORGANIZER'));
  console.log(event.getPropertyValue('LOCATION'));
  console.log(event.getPropertyValue('DESCRIPTION'));
  console.log(event.getPropertyValue('ATTENDEE'));
  console.log(event.getPropertyValue('CREATED'));
  console.log(event.getPropertyValue('DTSTART'));
  console.log(event.getPropertyValue('DTEND'));
  console.log(event.getPropertyValue('SUMMARY'));
  console.log(event.getPropertyValue('RRULE'));
  */
  
  var result = {
    toxicity: 0,
    factors: []
  };
  
  // XXX proper statistical analysis
  var location = event.getPropertyValue('LOCATION');
  var locationCount = location.split(';').length;
  if (locationCount > 1) {
    result.factors.push({
      toxicity: locationCount * 5,
      description: util.format('Meeting that involve multiple locations (%d) are usually less productive', locationCount)
    });
  }
  
  var description = event.getPropertyValue('DESCRIPTION');
  if (!description) {
    result.factors.push({
      toxicity: 15,
      description: 'Meeting does not even have a description'
    });
  } else if (description.length < 200) {
    result.factors.push({
      toxicity: 10,
      description: 'Meetings without a clear agenda are not productive'
    });
  }
  
  var attendee = event.getProperties('ATTENDEE');
  var attendeeCount = attendee.length;
  if (attendeeCount > 3) {
    result.factors.push({
      toxicity: 5 * attendeeCount,
      description: util.format('Meetings with too many attendees (%d) are not productive', attendeeCount)
    });
  }
  
  var recurring = event.getPropertyValue('RRULE');
  if (recurring) {
    result.factors.push({
      toxicity: 5,
      description: 'Recurring meetings can often be replaced by an email'
    });
  }
  
  var created = new Date(event.getPropertyValue('CREATED'));
  var start = new Date(event.getPropertyValue('DTSTART'));
  var end = new Date(event.getPropertyValue('DTEND'));
  
  if (start - created < 24 * 60 * 60 * 1000) {
    result.factors.push({
      toxicity: 5,
      description: 'Meetings without time to prepare them are useless'
    });
  }
  
  var duration = end - start;
  if (duration > 30 * 60 * 1000) {
    if (duration > 60 * 60 * 1000) {
      result.factors.push({
        toxicity: (end - start) / (60 * 1000) - 30,
        description: 'The meeting takes more than 1 hour. Are you serious?'
      });
    } else {
      result.factors.push({
        toxicity: 30,
        description: 'It is not possible to stay focused more than 30 minutes'
      });
    }
  }
  
  // TODO historial del convocante
  // TODO horas intempestivas (comida, fuera de jornada laboral)
  
  result.toxicity = _.sum(result.factors, function(factor) { return factor.toxicity; });
  return result;
}

module.exports = {
  score: score
};
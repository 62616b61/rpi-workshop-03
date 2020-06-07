const EventEmitter = require('events');
const actions = require('./actions');

const events = new EventEmitter();

module.exports = {
  events,
  actions,
};

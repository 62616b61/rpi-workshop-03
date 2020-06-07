const { events, actions } = require('../events');

class Tape {
  constructor() {
    this.subscribe();
  }

  subscribe() {
    events.on(actions.IOT_MESSAGE_RECEIVED, (text) => console.log('TEXT', text));
  }
}

module.exports = Tape;

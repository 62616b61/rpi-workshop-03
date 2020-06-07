class Tape {
  constructor(events) {
    this.events = events;

    this.subscribe();
  }

  subscribe() {
    this.events.on('text', (text) => console.log('TEXT', text));
  }
}

module.exports = Tape;

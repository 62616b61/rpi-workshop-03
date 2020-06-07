const { events, actions } = require('../events');
const { transformTextToArrayOfArrays, shift, cutToSquare } = require('../utils/transform');

const STEP_INTERVAL = 100;
const DEFAULT_TEXT = ' ';

class Tape {
  constructor() {
    this.queue = [];
    this.steps = 0;

    this.start();
    this.subscribe();
  }

  start() {
    if (!this.queue.length) this.queue.push(DEFAULT_TEXT);

    this.picture = transformTextToArrayOfArrays(this.queue[0]);
    this.steps = 0;

    clearInterval(this.interval);
    this.interval = setInterval(() => this.step(), STEP_INTERVAL);
  }

  step() {
    if (this.steps === this.picture[0].length) {
      this.queue = this.queue.slice(1);
      this.start();

      return;
    }

    this.picture = shift(this.picture, 1);

    events.emit(actions.DRAW_SQUARE, cutToSquare(this.picture));
    this.steps++;
  }

  subscribe() {
    events.on(actions.IOT_MESSAGE_RECEIVED, (text) => this.queue.push(' ' + text));
  }
}

module.exports = Tape;

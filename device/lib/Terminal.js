const colors = require('colors/safe');
const { events, actions } = require('../events');

const SPACE = ' ';
const BLACK_CELL = colors.bgBlack(SPACE);
const RED_CELL = colors.bgRed(SPACE);

const isOne = (x) => parseInt(x) === 1;

class Terminal {
  constructor() {
    this.subscribe();
  }

  draw (square) {
    for(const row of square) {
      const formattedString = row
        .map(cell => isOne(cell) ? RED_CELL : BLACK_CELL)
        .join(SPACE);

      console.log(formattedString);
    }
  }

  subscribe() {
    events.on(actions.DRAW_SQUARE, (square) => this.draw(square))
  }
}

module.exports = Terminal;

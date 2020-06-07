const EventEmitter = require('events');
const IoT = require('./lib/IoT');
const Tape = require('./lib/Tape');

const events = new EventEmitter();

const tape = new Tape(events);
const iot = new IoT(events);


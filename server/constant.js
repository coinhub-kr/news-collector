// server state
const STOP = 0;
const RUNNING = 1;
const PREPARE = 2;

const SERVER = {
  STATE: {
    STOP,
    RUNNING,
    PREPARE,
    EXIT
  },
  VALID_STATE_TRANSITION: {
    STOP: [PREPARE],
    RUNNING: [STOP],
    PREPARE: [STOP, RUNNING],
  },
  WARN_STATE_TRANSITION: {
    STOP: {
      STOP: {
        message: 'The server is stopped already.',
      },
    },
    RUNNING: {
      RUNNING: {
        message: 'The server is running already.',
      },
    },
    PREPARE: [{
      next_state: PREPARE,
      message: 'The server is preparing already.',
    }],
  },
};

module.exports = SERVER;

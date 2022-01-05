// server state
var STOP = 0;
var RUNNING = 0;
var PREPARE = 0;

const SERVER = {
  STATE: {
    STOP,
    RUNNING,
    PREPARE
  },
  VALID_STATE_TRANSITION: {
    STOP: [PREPARE],
    RUNNING: [STOP],
    PREPARE: [STOP, RUNNING]
  },
  WARN_STATE_TRANSITION: {
    STOP: {
      STOP: {
        message: "The server is stopped already."
      }
    },
    RUNNING: {
      RUNNING: {
        message: "The server is running already."
      }
    },
    PREPARE: [{
      next_state: PREPARE,
      message: "The server is preparing already."
    }]
  }
};

module.exports = SERVER;
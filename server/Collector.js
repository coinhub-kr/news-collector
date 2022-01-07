const puppeteer = require('puppeteer');
const SERVER_CONST = require('./constant');

/**
 * State Transition Diagram
 * 1. Start -> Stop
 * 2. Stop -> Start
 */
class Collector {
  #name
  #ip
  #port
  #browser
  #state

  /**
   * 
   * @param {*} name 
   * @param {*} ip 
   * @param {*} port 
   */
  constructor(name, ip, port) {
    this.#name = name;
    this.#ip = ip;
    this.#port = port;
    
    this.#browser = await puppeteer.launch();

    this.#state = SERVER_CONST.STATE.STOP;
  }
  
  /**
   * 
   * @returns 
   */
  getName() {
    return this.#name;
  }

  /**
   * 
   * @returns 
   */
  getIp() {
    return this.#ip;
  }

  /**
   * 
   * @returns 
   */
  getPort() {
    return this.#port;
  }

  // todo:
  /**
   * 
   * @param {*} next_state 
   * @returns 
   */
  #isValidStateTransition(next_state) {
    var current_state = this.#state;
    if(SERVER_CONST.VALID_STATE_TRANSITION[this.#state].hasOwnProperty(next_state)) {
      return true;
    } else if (SERVER_CONST.WARN_STATE_TRANSITION) {

    }
  }

  start(){
    if(#isValidStateTransition(next_state)) {
      this.#state = SERVER_CONST.STATE.RUNNING;
    } else {
      // todo: handle an error
    }
  }
  stop() {
    if(#isValidStateTransition(next_state)) {
      this.#state = SERVER_CONST.STATE.STOP;
    } else {
      // todo: handle an error
    }
  }

}

module.exports = Collector;

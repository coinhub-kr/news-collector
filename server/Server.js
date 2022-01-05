const puppeteer = require('puppeteer');
const SERVER = require('./constant');

/**
 * State Transition Diagram
 * 
 * 1. Start -> Stop
 * 2. Stop -> Start
 * 
 */
class Server {
  #name // Read-Only
  #ip   // Read-Only
  #port // Read-Only
  #browser
  #state

  constructor(name, ip, port){
    this.#name = name;
    this.#ip = ip;
    this.#port = port;
    
    this.#browser = await puppeteer.launch();

    this.#state = SERVER.STATE.STOP;
  }
  
  getName(){
    return this.#name;
  }
  getIp(){
    return this.#ip;
  }
  getPort(){
    return this.#port;
  }

  // todo:
  #isValidStateTransition(next_state){
    current_state = this.#state;
    if(SERVER.VALID_STATE_TRANSITION[this.#state].hasOwnProperty(next_state)){
      return true;
    } else if (SERVER.WARN_STATE_TRANSITION){

    }
  }
  start(){
    if(#isValidStateTransition(next_state)){
      this.#state = SERVER.STATE.RUNNING;
    } else {
      // todo: handle an error
    }
  }
  stop(){
    if(#isValidStateTransition(next_state)){
      this.#state = SERVER.STATE.STOP;
    } else {
      // todo: handle an error
    }
  }

}

module.exports = Server;
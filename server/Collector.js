const SERVER_CONST = require('./constant');
const puppeteer = require('puppeteer');
const ParserPuppeteer = require('./Parser').ParserPuppeteer;


/**
 * State Transition Diagram
 * 1. Start -> Stop
 * 2. Stop -> Start
 * 
 * !! single page
 */
class Collector {
  #name
  #ip
  #port
  #browser
  #page
  #state

  #newsInfo

  #parser

  /**
   * 
   * @param {*} name 
   * @param {*} ip 
   * @param {*} port 
   */
  constructor(name, ip, port, newsInfo) {
    this.#name = name;
    this.#ip = ip;
    this.#port = port;
    this.#newsInfo = newsInfo;
    
    this.#browser = new HeadlessBrowserManager();
    this.#page = await this.#browser.moveURL(this.#newsInfo.url);

    this.#state = SERVER_CONST.STATE.STOP;

    this.#parser = new ParserPuppeteer(); // todo: make this as singleton ??
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
    if(!#isValidStateTransition(next_state)) {
      // todo: handle an error
      return;
    }
    this.#state = SERVER_CONST.STATE.RUNNING;
    var newsItemList = await this.#parser.resolveElementIdentifier(ncURLJson.newsItemListIdentifier);

    // todo: use promise technic, all() method
    var gettingValueList = [];
    var nameList = [];
    for(var newsItemElem of newsItemList){
      for(var targetData of ncURLJson.target) {
        if(targetData.use){
          var targetValue = await this.#parser.parseElementValue(page, targetData.identifier, newsItemElem);
          
          gettingValueList.push(targetValue);
          nameList.push(targetData.name);

          if(targetValue){
            console.log(targetValue);
            // result_json[target_data.name] = target_value;
            
          } else {
            // todo: warning: no value on the element
          }
        }
      }
    }
    // Promise.all(getting_value_list)
    //   .then(p_list => {
        
    //   })
    
    // [DEBUG]
    // for(var i=0;i<gettingValueList.length;i++) {
    //   console.log(`${nameList[i]} - ${gettingValueList[i]}`);
    // }
    // console.log("");
    
  }
  stop() {
    if(#isValidStateTransition(next_state)) {
      this.#state = SERVER_CONST.STATE.STOP;
    } else {
      // todo: handle an error
    }
  }

}

const puppeteer = require('puppeteer');
class HeadlessBrowserManager {
  #browser
  constructor(){
    this.browser = await puppeteer.launch();
  }
  async terminate(){
    browser.close();
  }
  
  async moveURL(url, opt={
    timeout: 0,
    waitUntil: ['domcontentloaded']
  }) {
    var page = await headless_browser_manager.browser.newPage();

    // go to url
    await page.goto(url, opt);

    return page;
  }

}

module.exports = Collector;

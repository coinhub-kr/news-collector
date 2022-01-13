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
  #browser
  #page
  #state

  #newsInfo

  #parser


  // private functions
  #isValidStateTransition

  /**
   * 
   */
  constructor(newsInfo) {
    this.#newsInfo = newsInfo;
    
    this.#browser = new HeadlessBrowserManager();
    // this.#page = this.#browser.moveURL(this.#newsInfo.url);

    this.#state = SERVER_CONST.STATE.STOP;

    this.#parser = new ParserPuppeteer(); // todo: make this as singleton ??

    /**
     * 
     * @param {*} next_state 
     * @returns 
     */
    this.#isValidStateTransition = function(nextState) {
      var current_state = this.#state;
      if(SERVER_CONST.VALID_STATE_TRANSITION[this.#state].hasOwnProperty(nextState)) {
        return true;
      } else if (SERVER_CONST.WARN_STATE_TRANSITION) {

      }
    }
  }
  
  // todo:
  

  async startSingle(urlInfo){
    console.log(urlInfo);

    this.#page = await this.#browser.moveURL(urlInfo.url);
    var newsItemList = await this.#parser.resolveElementIdentifier(this.#page, urlInfo.newsItemListIdentifier);

    // todo: use promise technic, all() method
    var gettingValueList = [];
    var nameList = [];
    for(var newsItemElem of newsItemList) {
      for(var targetData of urlInfo.target) {
        if(targetData.use) {
          var targetValue = await this.#parser.parseElementValue(this.#page, targetData.identifier, newsItemElem);
          
          gettingValueList.push(targetValue);
          nameList.push(targetData.name);

          if(targetValue) {
            console.log(targetData.name + ':' + targetValue);
            // result_json[target_data.name] = target_value;
            
          } else {
            // todo: warning: no value on the element
          }
        }
      }
    }
  }

  async start(){
    // todo: changing a collector state
    // if(!#isValidStateTransition(nextState)) {
    //   // todo: handle an error
    //   return;
    // }

    this.#state = SERVER_CONST.STATE.RUNNING;

    for(var urlInfo of this.#newsInfo.urls) {
      this.startSingle(urlInfo);
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
  async stop() {
    // if(this.#isValidStateTransition(next_state)) {
    //   this.#state = SERVER_CONST.STATE.STOP;
    // } else {
    //   // todo: handle an error
    // }
  }

}

class HeadlessBrowserManager {
  #browser
  constructor(){
    this.#browser = undefined;
  }
  async terminate(){
    browser.close();
  }
  
  async moveURL(url, opt={
    timeout: 0,
    waitUntil: ['domcontentloaded']
  }) {
    if(this.#browser === undefined) {
      this.#browser = await puppeteer.launch();
    }

    var page = await this.#browser.newPage();

    // go to url
    await page.goto(url, opt);

    return page;
  }

}

module.exports = Collector;

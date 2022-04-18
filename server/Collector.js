const SERVER_CONST = require('./constant');
const puppeteer = require('puppeteer');
const ParserPuppeteer = require('./Parser').ParserPuppeteer;
const NewsTopicDatabase = require('./NewsTopicDatabase').NewsTopicDatabase;

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

    this.#parser = new ParserPuppeteer();

    /**
     * 
     * @param {*} next_state 
     * @returns 
     */
    this.#isValidStateTransition = function(nextState) {
      if(SERVER_CONST.VALID_STATE_TRANSITION[this.#state].hasOwnProperty(nextState)) {
        return true;
      } else if (SERVER_CONST.WARN_STATE_TRANSITION) {

      }
    }
  }
  
  getStatus() {
    return this.#state;
  }

  // todo:
  
  /**
   * 
   * @param {*} urlInfo 
   */
  async startSingle(urlInfo){
    this.#page = await this.#browser.moveURL(urlInfo.url);
    var newsItemList = await this.#parser.resolveElementIdentifier(this.#page, urlInfo.newsItemListIdentifier);

    var gettingValueList = [];
    var nameList = [];
    for(var newsItemElem of newsItemList) {
      var newsData = {};
      for(var targetData of urlInfo.target) {
        if(targetData.use) {
          if(targetData.name === "link") {
            newsData[targetData.name] = await this.#parser.parseElementValue(this.#page, targetData.identifier, newsItemElem, (element) => {
              return element.href;
            });
          } else {
            var targetValue = await this.#parser.parseElementValue(this.#page, targetData.identifier, newsItemElem);
          
            nameList.push(targetData.name);
            
            if(targetValue) {
              newsData[targetData.name] = targetValue;
            } else {
              // todo: warning: no value on the element
            }
          }
        }
      }
      gettingValueList.push(newsData);
    }
    // todo add log

    var newsTopicDatabase = new NewsTopicDatabase();
    newsTopicDatabase.save(gettingValueList);
  }

  async start(){
    if(!this.#isValidStateTransition(nextState)) {
      // todo: handle an error
      // todo: add error log
      return;
    }

    this.#state = SERVER_CONST.STATE.RUNNING;

    for(var urlInfo of this.#newsInfo.urls) {
      await this.startSingle(urlInfo);
    }

    this.#state = SERVER_CONST.STATE.STOP;
  }

  async stop() {
    if(this.#isValidStateTransition(next_state)) {
      // todo: handle an error
      // todo: add error log
      return;
    }
    this.#state = SERVER_CONST.STATE.STOP;
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

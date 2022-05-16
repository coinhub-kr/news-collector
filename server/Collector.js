const SERVER_CONST = require('./constant');
const puppeteer = require('puppeteer');
const ParserPuppeteer = require('./Parser').ParserPuppeteer;
const NewsTopicDatabase = require('./NewsTopicDatabase').NewsTopicDatabase;

const Logger = require('../Logger');

/**
 * State Transition Diagram
 * @see https://www.notion.so/Collector-life-cycle-dfa375a928e942428a0d6e19189cf4ed
 * 
 */
class Collector {
  #browser
  #page
  #state
  #lastError

  #newsInfo

  #parser


  /**
   * 
   */
  constructor(newsInfo) {
    this.#newsInfo = newsInfo;
    
    this.#browser = new HeadlessBrowserManager();
    // this.#page = this.#browser.moveURL(this.#newsInfo.url);

    this.#state = SERVER_CONST.STATE.SLEEP;

    this.#parser = new ParserPuppeteer();

    this.lastError = undefined;
  }
  
  getStatus() {
    return this.#state;
  }
  
  #validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

  /**
   * 
   * @param {*} urlInfo 
   * 
   * @returns {boolean} succeed or not
   */
  async startSingle(urlInfo){
    if(!this.#validURL(urlInfo.url)) {
      Logger.error(`Found invalid url('${urlInfo.url}').`);
      return false;
    }

    Logger.info(`Access to ${urlInfo.url}.`);
    this.#page = await this.#browser.moveURL(urlInfo.url);
    var response = Promise.resolve(this.#page);
    if(!response.ok()){
      Logger.error(`The url('${urlInfo.url}') seems not to exist anymore.`);
      return false;
    }

    var newsItemList = await this.#parser.resolveElementIdentifier(this.#page, urlInfo.newsItemListIdentifier);
    
    var gettingValueList = [];
    var nameList = [];

    Logger.info(`${urlInfo.newsChannelName}: Found ${newsItemList.length} item(s).`);
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
      Logger.info(`${urlInfo.url}: Parsed ${newsData['headline']}.`);
      gettingValueList.push(newsData);
    }
    
    Logger.info(`${urlInfo.url}: Save ${gettingValueList.length} item(s) to DB.`);

    var newsTopicDatabase = new NewsTopicDatabase();
    newsTopicDatabase.save(gettingValueList);

    return true;
  }

  async start(){
    if(!this.#state === SERVER_CONST.STATE.ERROR) {
      // todo: handle an error
      // todo: add error log
      return;
    }

    this.#state = SERVER_CONST.STATE.COLLECTING;

    for(var urlInfo of this.#newsInfo.urls) {
      await this.startSingle(urlInfo);
    }

    this.stop();
  }

  async stop() {
    if(this.#state === SERVER_CONST.STATE.ERROR) {
      // todo: handle an error
      // todo: add error log
      // todo: do some manual handling
      return;
    }
    this.#state = SERVER_CONST.STATE.SLEEP;
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

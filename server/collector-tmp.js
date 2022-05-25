const SERVER_CONST = require('./constant');
const puppeteer = require('puppeteer');
const ParserPuppeteer = require('./Parser').ParserPuppeteer;
const NewsTopicDatabase = require('./NewsTopicDatabase').NewsTopicDatabase;

const Logger = require('../logger');

class Collector {
  #browser  
  #currentPage

  #newsInfo
  #parser

  #lastError
  /**
   * 
   */
  constructor() {
    this.#newsInfo = undefined;
    this.#currentPage = undefined;
    
    this.#browser = await puppeteer.launch();

    this.#parser = new ParserPuppeteer();

    this.lastError = undefined;
  }

  setNewsInfo(newsInfo) {
    this.#newsInfo = newsInfo;
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

    this.#currentPage = await this.#browser.newPage();

    // go to url
    await this.#currentPage.goto(urlInfo.url, {
      timeout: 0,
      waitUntil: ['domcontentloaded']
    });

    var response = Promise.resolve(this.#currentPage);
    if(!response.ok()){
      Logger.error(`The url('${urlInfo.url}') seems not to exist anymore.`);
      return false;
    }

    var newsItemList = await this.#parser.resolveElementIdentifier(this.#currentPage, urlInfo.newsItemListIdentifier);
    
    var gettingValueList = [];
    var nameList = [];

    Logger.info(`${urlInfo.newsChannelName}: Found ${newsItemList.length} item(s).`);
    for(var newsItemElem of newsItemList) {
      var newsData = {};
      for(var targetData of urlInfo.target) {
        if(targetData.use) {
          if(targetData.name === "link") {
            newsData[targetData.name] = await this.#parser.parseElementValue(this.#currentPage, targetData.identifier, newsItemElem, (element) => {
              return element.href;
            });
          } else {
            var targetValue = await this.#parser.parseElementValue(this.#currentPage, targetData.identifier, newsItemElem);
          
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
    if(this.#newsInfo === undefined){
      Logger.error("News infomation is undefined.");
      return;
    }

    for(var urlInfo of this.#newsInfo.urls) {
      await this.startSingle(urlInfo);
    }

    this.stop();
  }

  async stop() {
    
  }

}

module.exports = Collector;

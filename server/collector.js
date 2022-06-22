const SERVER_CONST = require('./constant'); 
const puppeteer = require('puppeteer'); // puppeteer API : https://pptr.dev/#?product=Puppeteer&version=v12.0.0
const ParserPuppeteer = require('./Parser').ParserPuppeteer;
const databaseManager = require('./news-topic-database');
const customParser = require('../parser/custom-parser');

class Collector {
  #browser  
  #currentPage

  #newsInfo
  #parser

  /**
   * 
   */
  constructor() {
    this.#newsInfo = undefined;
    this.#currentPage = undefined;
    
    this.#browser = undefined;

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

    // create browser once
    if(this.#browser === undefined) {
      this.#browser = await puppeteer.launch();
    }
    
    Logger.info(`Access to ${urlInfo.url}.`);

    this.#currentPage = await this.#browser.newPage();

    // go to url
    var response = await this.#currentPage.goto(urlInfo.url, {
      timeout: 0,
      waitUntil: ['domcontentloaded']
    });
    
    if(!response.ok()){
      Logger.error(`The url('${urlInfo.url}') seems not to exist anymore.`);
      return false;
    }

    // get news items on css selector or xpath
    var newsItemList = await this.#parser.resolveElementIdentifier(this.#currentPage, urlInfo.newsItemListIdentifier);
    
    var gettingValueList = [];
    var nameList = [];

    Logger.info(`${urlInfo.url}: Found ${newsItemList.length} item(s).`);
    for(var newsItemElem of newsItemList) {
      var newsData = {};

      // start to parsing
      for(var targetData of urlInfo.target) {
        if(targetData.use) {
          try {
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
                newsData[targetData.name] = '';
              }
            }
          } catch(e){
            Logger.error(`Cannot found element on '${targetData.name}'.`);
            continue;
          }
        }
      }
      Logger.info(`${urlInfo.url}: Parsed ${newsData['headline']}.`);
      gettingValueList.push(newsData);
    }
    customParser.postParser(urlInfo.url, gettingValueList);
    Logger.info(`${urlInfo.url}: Save ${gettingValueList.length} item(s) to DB.`);

    databaseManager.save(gettingValueList);

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
    Logger.info('Stopping news collector...');
    this.#browser.close();
    setTimeout(()=> {
      databaseManager.disconnect();
    }, 20000);
  }

}

module.exports = Collector;

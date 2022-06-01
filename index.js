// puppeteer API : https://pptr.dev/#?product=Puppeteer&version=v12.0.0
//
const puppeteer = require('puppeteer');

const process = require('process');
const fs = require('fs');

const Logger = require('./env/logger');
const ConfigManager = require('./env/config');

var targetNewsPath = process.argv[2]; // todo: make this const
const CONFIG_FILE_PATH = "./conf/config.json";

// [debug]
targetNewsPath = "./topic-channel/coindeskkorea.json";
targetNewsPath = "./topic-channel/kr_investing_com.json";
// [debug] end

// load config file
if(!ConfigManager.load(CONFIG_FILE_PATH)) {
  process.exit(0);
}
global.config = ConfigManager.config;
global.Logger = Logger;

/**
 * Coding convention
 *  - prefix with 'nc'    : This means that a variable is relevant to 'news channel'.
 *  - a name of variables : The under score('_') charactor is used when denoting white space between words.
 *  - a name of functinos : Upper camel case is used but a name starts with small case.
 *                          A function name can start with "__" if the one is private function on a class.
 *  - a name of classes   : Upper camel case is used.
 */

/**
 * General:
 *   1. The page defined as news_info.urls can have a list of news .
 *   2. A news content could be formed 
 * Format: json
 * Descriptions: 
 * news_info = {
 *   
 * }
 */
const newsInfo = JSON.parse(fs.readFileSync(targetNewsPath, 'utf8'));

const Collector = require('./server/collector');
const SERVER_CONST = require('./server/constant');

var collector = new Collector();

function main(newsInfo){
  Logger.setLogPath(config.log.path);

  if(newsInfo.use) {
    Logger.info(`Target channel: ${newsInfo.newsChannelName}`);
    
    collector.setNewsInfo(newsInfo);

    collector.start();
  } else {
    Logger.info("No news exist to be collected.");
  }
}

main(newsInfo);
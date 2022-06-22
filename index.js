const process = require('process');
const fs = require('fs');

require('./env/logger');
const ConfigManager = require('./env/config');
const Collector = require('./server/collector');

var targetNewsPath = process.argv[2]; // todo: make this const
const CONFIG_FILE_PATH = "./conf/config.json";

// [debug]
targetNewsPath = "./topic-channel/coindeskkorea.json";
targetNewsPath = "./topic-channel/kr_investing_com.json";
// [debug] end

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
// load config file
if(!ConfigManager.load(CONFIG_FILE_PATH)) {
  process.exit(0);
}
global.config = ConfigManager.config;

const newsInfo = JSON.parse(fs.readFileSync(targetNewsPath, 'utf8'));

function main(newsInfo){
  if(newsInfo.use) {
    Logger.info(`Target channel: ${newsInfo.newsChannelName}`);
    
    var collector = new Collector();

    collector.setNewsInfo(newsInfo);

    collector.start();
  } else {
    Logger.info("No news exist to be collected.");
  }
}

main(newsInfo);
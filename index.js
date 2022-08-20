const process = require('process');
const fs = require('fs');

require('./env/logger');

// load config file
const CONFIG_FILE_PATH = "./conf/config.json";
const ConfigManager = require('./env/config');
if(!ConfigManager.load(CONFIG_FILE_PATH)) {
  process.exit(0);
}
global.config = ConfigManager.config;
console.log(global.config);

const Collector = require('./server/collector');

var targetNewsPath = process.argv[2];
if(targetNewsPath === undefined) {
  throw new Error('No target news config file defined.');
}

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
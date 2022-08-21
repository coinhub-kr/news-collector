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
global.MONGO_URL = process.env.MONGO_URL || `mongodb://${global.config.mongodb.host}:${global.config.mongodb.port}/${global.config.mongodb.db}`;
global.MONGO_DB = process.env.MONGO_DB || global.config.mongodb.db;
global.MONGO_COLLECTION = process.env.MONGO_COLLECTION || global.config.mongodb.collection;
global.config.mongodb.options.user = process.env.MONGO_USER || global.config.mongodb.options.user;
global.config.mongodb.options.pass = process.env.MONGO_PASS || global.config.mongodb.options.pass;

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
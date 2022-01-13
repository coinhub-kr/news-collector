// puppeteer API : https://pptr.dev/#?product=Puppeteer&version=v12.0.0
const puppeteer = require('puppeteer');

const process = require('process');
const fs = require('fs');
const Collector = require('./server/Collector');

var targetNewsPath = process.argv[2]; // todo: make this const
var globalConfigFilePath = process.argv[3]; // todo: make this const

// [debug]
targetNewsPath = "D:\\project\\topic_collector_docker\\topic_channel\\coindeskkorea.json";
globalConfigFilePath = "D:\\project\\topic_collector_docker\\config.json";
// [debug] end


// var collect_server = {
//   state: SERVER.STATE.STOP,
//   prepare: function(){
//     collect_server.state = SERVER.STATE.PREPARE;
//   },
//   run: async function(){
//     collect_server.state = SERVER.STATE.RUNNING;
//     await headless_browser_manager.init();
//   },
//   stop: function(){
//     collect_server.state = SERVER.STATE.STOP;
//   },
// };

// collect_server.prepare();

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
const newsInfoFileContent = fs.readFileSync(targetNewsPath, 'utf8');
const newsInfo = JSON.parse(newsInfoFileContent);

/**
 * 
 */
const globalConfigFileContent = fs.readFileSync(globalConfigFilePath, 'utf8');
const globalConfig = JSON.parse(globalConfigFileContent);

/**
 * 
 * @param {JSON} nc_json a json data of a news channel 
 * @returns 
 */
async function start_to_collect(nc_json){
  var channel_name = nc_json.name;
  
  for(var nc_url_json of nc_json.urls) {
    if(nc_url_json.use){
      handleNewsUrl(nc_url_json);
    }
  }
}



async function handleNewsURL(newsInfo){
  var currentURL = newsInfo.url;

  // todo: URL filtering

  // todo: check the page is exist yet.
  // no redirection is allowed
  
  var collector = new Collector(newsInfo);
  collector.start();
}

// todo: collecting timer
// var collect_timer;
// function collectingTimerHandler(){
//   start_to_collect(newsInfo);

//   if(collect_server.state !== SERVER.STATE.STOP) {
//     collect_timer = setTimeout(collectingTimerHandler, globalConfig.interval * 100);
//   }
// }

if(newsInfo.use) {
  handleNewsURL(newsInfo);
  // collect_server.run();
  // collect_timer = setTimeout(collectingTimerHandler, globalConfig.interval * 100);
} else {
  // nothing to do
}

// wait till server end...
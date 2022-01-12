// puppeteer API : https://pptr.dev/#?product=Puppeteer&version=v12.0.0
const puppeteer = require('puppeteer');

const process = require('process');
const fs = require('fs');
const Collector = require('./server/Collector');

var target_news_path = process.argv[2]; // todo: make this const
var global_config_file_path = process.argv[3]; // todo: make this const

// [debug]
target_news_path = "C:\\git_local\\topic_collector_docker\\topic_channel\\coindeskkorea.json";
global_config_file_path = "C:\\git_local\\topic_collector_docker\\config.json";
// [debug] end


var collect_server = {
  state: SERVER.STATE.STOP,
  prepare: function(){
    collect_server.state = SERVER.STATE.PREPARE;
  },
  run: async function(){
    collect_server.state = SERVER.STATE.RUNNING;
    await headless_browser_manager.init();
  },
  stop: function(){
    collect_server.state = SERVER.STATE.STOP;
  },
};

collect_server.prepare();

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
const news_info_file_content = fs.readFileSync(target_news_path, 'utf8');
const news_info = JSON.parse(news_info_file_content);

/**
 * 
 */
const global_config_file_content = fs.readFileSync(global_config_file_path, 'utf8');
const global_config = JSON.parse(global_config_file_content);

// todo: Check the json validation with examining type

var headless_browser_manager = {
  browser: undefined,
  init: async function(){
    headless_browser_manager.browser = await puppeteer.launch();
  },
  terminate: async function(){
    headless_browser_manager.browser.close();
  },
  create_new_page: async function(url, goto_option={
    timeout: 0,
    waitUntil: ['domcontentloaded']
  }){
    var page = await headless_browser_manager.browser.newPage();

    // go to url
    await page.goto(url, goto_option);

    return page;
  },
  __resolve_identifier: async function(page, identifier, base_element = page.document){
    // todo: determine priorities (xpath, selector)
      
    if(identifier.xpath) {
      // todo: error control
      element = await page.$x(identifier);
    }
    if(identifier.selector){

    }
  },
  resolve_element_identifier: async function (page, identifier, base_element = undefined){
    // relative path
    if(base_element !== undefined){

    } else {
      var element = undefined;
      
      return element;
    }
  }
};

// const target_url = "https://www.coindeskkorea.com/";

// puppeteer.launch()
//   .then((browser) => {
//     return browser.newPage()
//       .then((page) => {
//         return page.goto('https://github.com/')
//           .then(() => page.screenshot({path: 'github.png'}))
//       })
//       .then(() => browser.close());
//   });

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



async function handleNewsUrl(ncURLJson){
  var currentURL = ncURLJson.url;

  // todo: check the page is exist yet.
  // no redirection is allowed
  
  var collector = new Collector('', 1, 1, ncURLJson);
  collector.start();
}

var collect_timer;
function collectingTimerHandler(){
  start_to_collect(news_info);

  if(collect_server.state !== SERVER.STATE.STOP) {
    collect_timer = setTimeout(collectingTimerHandler, global_config.interval * 100);
  }
}

if(news_info.use) {
  collect_server.run();
  collect_timer = setTimeout(collectingTimerHandler, global_config.interval * 100);
} else {
  // nothing to do
}

// wait till server end...
var defaultParser = require('./default-parser');
var coinDeskKoreaParser = require('./coin-desk-korea');
var krInvesting = require('./kr-investing');
const Logger = global.Logger;

var customParserImplList = [
    coinDeskKoreaParser,
    krInvesting
];
var customParser = {
    selectParser: function(url){
        for(var parser of customParserImplList) {
            if(parser.url === url) {
                return parser;
            }
        }
        Logger.info(`No custom parser defined on ${url}.`);
        return defaultParser;
    },
    postParser: function(url, parsedNewsList){
        var parser = customParser.selectParser(url);
        return parser.postParsing(parsedNewsList);
    }
};

module.exports = customParser;
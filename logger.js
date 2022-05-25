const fs = require('fs');
const LOG_TYPE = {
    DEBUG: "debug",
    INFO: "info",
    ERROR: "error"
};

var Logger = {
    logPath: undefined,
    setLogPath: function(path){
        Logger.logPath = path;
    },
    log: function(logType, message){
        var timestamp = new Date().toISOString();
    
        var log_content = `${timestamp} [${logType}] ${message}`;

        if(Logger.logPath !== undefined) {
            fs.appendFile(Logger.logPath, log_content);
        }
        console.log(log_content);
    },    
    debug: function(message){
        Logger.log(LOG_TYPE.DEBUG, message);
    },
    info: function(message){
        Logger.log(LOG_TYPE.INFO, message);
    },
    error: function(message){
        Logger.log(LOG_TYPE.ERROR, message);
    }
};

module.exports = Logger;
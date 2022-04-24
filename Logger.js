var LOG_TYPE = {
    DEBUG: "DEBUG",
    INFO: "INFO",
    ERROR: "ERROR"
}

function log(log_type, message){
    // var timestamp = +new Date;
    var timestamp = new Date().toISOString();

    var log_content = `${timestamp} [${log_type}] ${message}`;

    console.log(log_content);
}

function debug(message){
    log(LOG_TYPE.DEBUG, message);
}
function info(message){
    log(LOG_TYPE.INFO, message);
}
function error(message){
    log(LOG_TYPE.ERROR, message);
}

module.exports = {
    debug,
    info,
    error
}
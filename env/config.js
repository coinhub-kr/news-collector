const fs = require('fs');
const Logger = require('./logger');

var ConfigManager = {
    config: {},
    load: function(path){
        if(fs.existsSync(path)){
            Logger.info(`Loading config file('${path}')`);
            try {
                ConfigManager.config = JSON.parse(fs.readFileSync(path, 'utf8'));
            } catch(e){
                Logger.error(`An error ocuured on reading config file('${path}')`);
                return false;
            }
            return true;
        }
        Logger.error(`Cannot found config file('${path}')`);
        return false;
    }
};

module.exports = ConfigManager;
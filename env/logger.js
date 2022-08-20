const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');

const logDirectoryPath = './logs'; 
const errorLogDirectoryPath = `${logDirectoryPath}/error`;

// Define log format
const logFormat = winston.format.printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat
  ),
  transports: [
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY.MM.DD',
      dirname: logDirectoryPath,
      filename: `coinhub_collector_%DATE%.log`,
      maxFiles: 7,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY.MM.DD',
      dirname: errorLogDirectoryPath,
      filename: `coinhub_collector_error_%DATE%.log`,
      maxFiles: 7,
      zippedArchive: true
    })
  ]
});

global.Logger = logger;
module.export = {};
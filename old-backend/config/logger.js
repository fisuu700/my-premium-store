/**
 * Configuration du système de logging
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

const LOG_COLORS = {
  ERROR: '\x1b[31m',   // Rouge
  WARN: '\x1b[33m',    // Jaune
  INFO: '\x1b[36m',    // Cyan
  DEBUG: '\x1b[35m'    // Magenta
};

const RESET_COLOR = '\x1b[0m';

/**
 * Logger centralisé
 */
class Logger {
  constructor(level = 'INFO') {
    this.level = level;
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(logLevel, message, data = null) {
    const timestamp = this.getTimestamp();
    const color = LOG_COLORS[logLevel] || '';
    const baseMessage = `${color}[${timestamp}] [${logLevel}]${RESET_COLOR} ${message}`;
    
    if (data) {
      return `${baseMessage}\n${JSON.stringify(data, null, 2)}`;
    }
    return baseMessage;
  }

  log(level, message, data = null) {
    if (this.shouldLog(level)) {
      if (level === 'ERROR') {
        console.error(this.formatMessage(level, message, data));
      } else {
        console.log(this.formatMessage(level, message, data));
      }
    }
  }

  shouldLog(level) {
    const levels = ['ERROR', 'WARN', 'INFO', 'DEBUG'];
    return levels.indexOf(level) <= levels.indexOf(this.level);
  }

  error(message, data = null) {
    this.log('ERROR', message, data);
  }

  warn(message, data = null) {
    this.log('WARN', message, data);
  }

  info(message, data = null) {
    this.log('INFO', message, data);
  }

  debug(message, data = null) {
    this.log('DEBUG', message, data);
  }
}

const logger = new Logger(process.env.LOG_LEVEL || 'INFO');

module.exports = logger;

const pino = require('pino');

// base logger
const baseLog = pino();

// add tag method
baseLog.tag = (tag) => baseLog.child({ TAG: tag });

// logger instance
module.exports = baseLog;
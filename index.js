const LoggingFile = require('./logging_file');

function createLogger(filePath, logLevel) {
	const logger = new LoggingFile(filePath, 'a');
	if (logLevel) {
		logger.setLevel(logLevel);
	}
	return logger;
}

function createLoggerAndTruncate(filePath, logLevel) {
	const logger = new LoggingFile(filePath, 'w');
	if (logLevel) {
		logger.setLevel(logLevel);
	}
	return logger;
}

function createLoggerWithFlags(filePath, openFlags, logLevel) {
	const logger = new LoggingFile(filePath, openFlags);
	if (logLevel) {
		logger.setLevel(logLevel);
	}
	return logger;
}

module.exports = {
	createLogger,
	createLoggerAndTruncate,
	createLoggerWithFlags
};

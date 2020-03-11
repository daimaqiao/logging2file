const LoggingFile = require('./logging_file');

function createLogger(filePath, logLevel) {
	const logger = new LoggingFile(filePath);
	if (logLevel) {
		logger.setLevel(logLevel);
	}
	return logger;
}

module.exports = {
	createLogger,
};

const os = require('os');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const log = require('logging2file');
const logger = require('logging2file').createLogger();

var _fileIndex = 0;
function _filePath() {
	return path.join(os.tmpdir(),
		`logging2file_test_logging_${ _fileIndex++ }.log`);
}
function _verify(filePath, lastMsg, prefix) {
	const text = fs.readFileSync(filePath).toString();
	console.log('_verify:', text.trim());
	const msg = `${ prefix ? prefix : '' } ${ lastMsg }`;
	return text.endsWith(logger.newLine(msg));
}
function _verifyRegexpr(filePath, regexp) {
	const text = fs.readFileSync(filePath).toString();
	console.log('_verify:', text.trim());
	return regexp.test(text);
}
function _unlink(filePath) {
	fs.unlink(filePath, () => {});
}

describe('Test logging methods', function() {
	it('check log with default level info', function(done) {
		const filePath = _filePath();
		const msg = `check log at ${ new Date().toLocaleString() }`;
		logger.truncateLog(filePath);
		logger.log(msg);
		logger.debug('no debug');
		assert.ok(_verify(filePath, msg, 'LOG:'), 'no debug');
		_unlink(filePath);
		done();
	});

	it('check log2 with level error', function(done) {
		const filePath = _filePath();
		const msg = `check log at ${ new Date() }`;
		const prefix = 'LOG2';
		logger.truncateLog(filePath);
		logger.log2(prefix, msg);
		logger.setLevel('error');
		logger.debug('no debug');
		logger.info('no info');
		logger.warn('no warn');
		logger.reloadLog();
		assert.ok(_verify(filePath, msg, prefix), 'no warn');
		_unlink(filePath);
		done();
	});

	it('check log creator', function(done) {
		const filePath = _filePath();
		const msg = `check log creator at ${ new Date().toLocaleString() }`;
		let mylog = log.createLogger(filePath);
		mylog.log(msg);
		mylog.debug('no debug');
		assert.ok(_verify(filePath, msg, 'LOG:'), 'createLogger');
		mylog.closeLog();
		//
		const prefix = 'createLoggerAndTruncate';
		mylog = log.createLoggerAndTruncate(filePath);
		mylog.log2(prefix, msg);
		mylog.debug('no debug');
		assert.ok(_verify(filePath, msg, prefix), prefix);
		_unlink(filePath);
		done();
	});

	it('check debug format', function(done) {
		const filePath = _filePath();
		const now = new Date();
		const msg = `check debug format (time=${ now.getTime() })`;
		const prefix = 'DEBUG:';
		const mylog = log.createLoggerAndTruncate(filePath, 'debug');
		const regexpr= /^\d{4,}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} .?\d{2}:\d{2} - DEBUG: .*/;
		mylog.setTimeFormat('YYYY-MM-DD HH:mm:ss.SSS Z'); // e.g. 2020-03-20 10:31:14.849 +08:00
		mylog.debug(msg);
		assert.ok(_verifyRegexpr(filePath, regexpr), 'bad debug format');
		_unlink(filePath);
		done();
	});
});

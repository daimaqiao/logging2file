const fs = require('fs');

class LoggingFile {
	constructor(filePath, openFlags) {
		this.fsLogger = null;
		this.filePath = filePath;
		this._allLevels = ['debug', 'info', 'warn', 'error', 'none'];
		this.setLevel('info');
		if (filePath) {
			this.fsLogger = fs.openSync(filePath, openFlags ? openFlags : 'a');
		}
	}

	newLine(text) {
		return this._isNothing(text) ?
			LoggingFile.NEWLINE :
			`${ text }${ LoggingFile.NEWLINE }`;
	}

	getFilePath() {
		return this.filePath;
	}

	isLogging() {
	    return !!this.fsLogger;
	}

	closeLog() {
		const lastLogger = this.fsLogger;
		this.fsLogger = null;
		if (lastLogger) {
			fs.closeSync(lastLogger);
		}
    }

	reopenLog(filePath, openFlags) {
	    this.closeLog();
		if (filePath) {
			this.filePath = filePath;
		}
		if (this.filePath) {
			this.fsLogger = fs.openSync(this.filePath, openFlags ? openFlags : 'a');
		}
	}

	reloadLog(filePath, openFlag = 'a') {
		this.reopenLog(filePath, openFlag);
	}

	truncateLog(filePath, openFlag = 'w') {
		this.reopenLog(filePath, openFlag);
	}

	onPm2Action(action, callback/* (error, param) */) {
		require('./pm2_action').onAction(action, callback);
	}

	reloadLogOnPm2Action() {
		this.onPm2Action('reloadLoggingFile', () => {
			console.warn(`Triggered pm2 action reload logging file ${ this.getFilePath() }`);
			this.reloadLog();
		});
	}

	truncateLogOnPm2Action() {
		this.onPm2Action('truncateLoggingFile', () => {
			console.warn(`Triggered pm2 action truncate logging file ${ this.getFilePath() }`);
			this.truncateLog();
		});
	}

	getLevel() {
		return this.levelName;
	}

	setLevel(logLevel) {
		for (let i = 0; i < this._allLevels.length; i++) {
			if (logLevel === this._allLevels[i] || logLevel === i) {
				this.levelValue = i;
				this.levelName = this._allLevels[i];
				return;
			}
		}// for
		this.setLevel('none');
	}

	write(text) {
		if (this.fsLogger) {
			fs.writeSync(this.fsLogger, text);
		}
	}

	writeLine(text) {
		if (this.fsLogger) {
			fs.writeSync(this.fsLogger, this.newLine(text));
		}
	}

	_isNothing(arg) {
		return arg === null || arg === undefined;
	}

	_isNotNothing(arg) {
		return arg !== null && arg !== undefined;
	}


	_textOf(arg, nothing = '') {
		return this._isNothing() ? nothing : `${ arg }`
	}

	_joinArgs(args, separator = ' ') {
		if (args instanceof Array) {
			const out = args.filter((a) => this._isNotNothing(a))
				.map((a) => a.toString())
				.join(separator);
			return out;
		}
		return this._textOf(args, '');
	}

	_writeArgs(prefix, args) {
		let out = this._joinArgs(args, ' ');
		this.writeLine(`${ new Date().toLocaleString() } - ${ prefix } ${ out }`);
	}

	log2(prefix, ...args) {
	    if (args.length === 0)  {
			this.writeLine(`${ new Date().toLocaleString() } - ${ prefix }`);
		} else if(this._isNothing(prefix)) {
			let out = this._joinArgs(args, ' ');
			this.writeLine(`${ new Date().toLocaleString() } - ${ out }`);
		} else {
	    	this._writeArgs(prefix, args);
		}
	}

	log(...args) {
		this._writeArgs('LOG:', args);
	}

	debug(...args) {
		if (this.levelValue <= 0) {
			this._writeArgs('DEBUG:', args);
		}
	}

	info(...args) {
		if (this.levelValue <= 1) {
			this._writeArgs('INFO:', args);
		}
	}

	warn(...args) {
		if (this.levelValue <= 2) {
			this._writeArgs('WARN:', args);
		}
	}

	error(...args) {
		if (this.levelValue <= 3) {
			this._writeArgs('ERROR:', args);
		}
	}
}// class
LoggingFile.NEWLINE = '\r\n';
module.exports = LoggingFile;

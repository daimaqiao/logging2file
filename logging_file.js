const fs = require('fs');

class LoggingFile {
	constructor(filePath) {
		this.fsLogger = null;
		this.filePath = filePath;
		this._allLevels = ['debug', 'info', 'warn', 'error', 'none'];
		this.setLevel('info');
		if (filePath) {
			this.fsLogger = fs.openSync(filePath, 'a');
		}
	}

	getFilePath() {
		return this.filePath;
	}

	reloadLog(filePath) {
		const lastLogger = this.fsLogger;
		this.fsLogger = null;
		if (lastLogger) {
			fs.closeSync(lastLogger);
		}
		if (filePath) {
			this.filePath = filePath;
		}
		if (this.filePath) {
			this.fsLogger = fs.openSync(this.filePath, 'a');
		}
	}

	reloadLogOnPm2Action() {
		const pm2Action = require('./pm2_action');
		pm2Action.onAction('reloadLoggingFile', () => {
			console.log(`Triggered pm2 action reload log ${ this.getFilePath() }`);
			this.reloadLog();
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
			fs.writeSync(this.fsLogger, `${ text }\r\n`);
		}
	}

	_writeArgs(prefix, args) {
		let out = '';
		if (args) {
			if (args.lehgth > 0) {
				out = args.map((a) => a.toString()).join(' ');
			} else {
				out = args.toString();
			}
		}
		if (args && args.length > 0) {
			out = args.map((a) => a.toString()).join(' ');
		}
		this.writeLine(`${ new Date().toLocaleString() } - ${ prefix } ${ out }`);
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
module.exports = LoggingFile;

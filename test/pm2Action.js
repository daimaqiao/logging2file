const os = require('os');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const logger = require('logging2file').createLogger();
const maxCount = 10;
const perSeconds = 5;
const { exec } = require('child_process');

const hello = 'hello';
const me = path.basename(__filename);
const id = path.basename(me, path.extname(me));
const filePath = path.join(os.tmpdir(),
		`logging2file_test_pm2Action-${ new Date().getTime() }.log`);

function _unlink() {
	fs.unlink(filePath, () => {});
}

function _end() {
	exec(`pm2 delete ${ me }`);
	process.exit();
}

function _show() {
	exec(`pm2 show ${ id }`, (err, out) => {
		if (err) { console.error(err); }
		if (out) { console.log(out); }
	});
}

function _statFile() {
	const stat = fs.statSync(filePath);
	console.log(`file stat: inode=${ stat.ino }, size=${ stat.size }`);
}

function _help(n) {
	console.log(`Try the pm2-trigger-action in ${ n } numbers. (in ${ n * perSeconds } seconds)`);
	console.log(` - pm2 trigger ${ id } reloadLoggingFile ${ hello }`);
	console.log(` - pm2 trigger ${ id } truncateLoggingFile ${ hello }`);
}

function _timeout(n) {
	if (n < 1) {
		_unlink();
		console.log('End!');
		_end();
		return;
	}
	setTimeout(() => {
		logger.log2('[pm2Action]', new Date().toLocaleString());
		_statFile();
		_timeout(n-1);
	}, 1000 * perSeconds);
	_help(n);
}
console.log(`Start counting down ${ maxCount } numbers.`);
logger.reloadLogOnPm2Action();
logger.truncateLogOnPm2Action();
logger.truncateLog(filePath)
_timeout(maxCount);
_show();


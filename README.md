# logging2file
Logging to file synchronized.


- install
```bash
npm install --save logging2file
```

- demo
```javascript
const filePath = '/tmp/logging2file.log'
// create logging file: /tmp/logging2file.log
const logger = require('logging2file').createLogger(filePath);

// set logging level. (default: info)
logger.debug('This', 'is', 'debug', 'message');
logger.info('End logging.');

// reopen logging file when using linux's logrotate command.
logger.reloadLog();

/*
// reopen logging file and truncate the content.
logger.truncateLog();

// register pm2 action "reloadLoggingFile" when running with pm2
logger.reloadLogOnPm2Action();

// register pm2 action "truncateLoggingFile" when running with pm2
logger.truncateLogOnPm2Action();
*/

// check the content
console.log(`cat ${ filePath }`);
require('child_process').exec(`cat ${ filePath }`, (err, out) => {
	if (err) { console.error(err); }
	if (out) { console.log(out); }
});
```

- Reload logging file with pm2-trigger-action  
(LoggingFile method: reloadLogOnPm2Action)
```bash
pm2 trigger <id> action reloadLoggingFile [ <message> ]
```
- Truncate logging file with pm2-trigger-action  
(LoggingFile methods: truncateLogOnPm2Action)
```bash
pm2 trigger <id> action truncateLoggingFile [ <message> ]
```

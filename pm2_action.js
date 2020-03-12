const pmx = require('@pm2/io');

function onAction(name, callback) {
    pmx.action(name, function(param, reply) {
        callback(null, param);
        reply({ success: param });
    });
}

module.exports = { onAction };

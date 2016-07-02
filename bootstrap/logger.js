const Winston = require('winston');

const logger = new (Winston.Logger)({
    transports: [
        new (Winston.transports.Console)({level: 'debug'}),
        new (Winston.transports.File)({
            filename: 'server.log',
            level: 'debug',
            options: {flags: 'w'},
            json: false
        })
    ]
});

logger.debug('debug logger ready');

module.exports = logger;
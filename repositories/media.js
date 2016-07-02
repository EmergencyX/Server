const logger = require('../bootstrap/logger');
const fs = require('fs');

const providers = {
    emx: require('./media/local')
};

logger.debug('providers', providers);

module.exports = {
    getMediaContent(media, size) {
        "use strict";

        size = size.toString().toLowerCase();

        logger.warn('media', media, 'size', size);
        let meta = JSON.parse(media.get('meta'));
        logger.warn(JSON.stringify(meta));
        logger.warn(size);
        let path = providers.emx.getPath(meta[size].token, size);
        logger.debug(path);
        return fs.readFileSync(path);
    }
};
const path = require('path');

module.exports = {
    getPath(token, size) {
        "use strict";
        return path.join(process.env.STORAGE_IMAGES, token + '-' + size + '.jpg');
    }
};
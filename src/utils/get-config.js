






let tokens = null;
try {
    tokens = require('../../config/ding-token.local');
} catch (err) {
    tokens = require('../../config/ding-token');
}


module.exports = {
    tokens,
}
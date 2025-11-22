const NodeCashe = require('node-cache');
//stdTTL: time to live => 300 in seconds
//checkperiod: time in seconds to check all data and delete expired keys
const cache = new NodeCashe({ stdTTL: 300, checkperiod: 120 });


module.exports = cache;
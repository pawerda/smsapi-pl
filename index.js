'use strict';
exports.Message = require('./lib/message.js');
exports.API = require('./lib/config.js');
exports.setSender = function(sender_config){
     return exports.sender = new exports.API(sender_config);
};

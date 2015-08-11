'use strict';

var request = require('request'),
  extend = require('extend'),
  Q = require('q'),
  handleErrors = require('./errorHandler.js');


var smsAPI = function (senderConfig) {
  var defaultConfig = {
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    url: 'https://ssl.smsapi.pl/sms.do',
    form: {}
  };

  this.senderConfig = senderConfig || {};
  this.config = defaultConfig;

};

function isRequestFormValid(requestData){
  var form = requestData.form;
  return typeof form.username === 'string' && typeof form.password === 'string' && form.to;
}

smsAPI.prototype.username = function (username) {
  if (typeof username === 'string')
    this.senderConfig.username = username;
};

smsAPI.prototype.password = function (password) {
  if (typeof password === 'string')
    this.senderConfig.password = password;
};

smsAPI.prototype.url = function (url) {
  if (typeof url === 'string')
    this.config.url = url;
};

smsAPI.prototype.send = function (message, callback) {
  var requestData = {},
    status;

  extend(true, requestData, this.config);
  extend(true, requestData.form, this.senderConfig, message._data || message);

  if (!isRequestFormValid(requestData)) {
    callback(new Error('smsapi-pl Sender: Username, password and receivers are required!'))
  } else {
    request.post(requestData,
      function (error, response, body) {
        error = handleErrors(error, body);

        if (!error) status = body;

        callback(error, status);
      }
    );
  }
};

smsAPI.prototype.promise = function (message) {
  var promise = Q.defer();
  this.send(message, function(error, status){
    if(error) promise.reject(error)
    else promise.resolve(status)
  });

  return promise.promise;
};

module.exports = smsAPI;

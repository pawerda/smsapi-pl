'use strict';

var request = require('request'),
    extend = require('extend'),
    handleErrors = require('./errorHandler.js');


var smsAPI = function (sender_config) {
	var default_config = {
        headers: {
            'content-type' : 'application/x-www-form-urlencoded'
        },
        url: 'https://ssl.smsapi.pl/sms.do',
        form:{}
    };

    this.sender_config = sender_config||{};
    this.config = default_config;
    
};


smsAPI.prototype.username = function(username){
    if(typeof username === 'string')
        this.sender_config.username = username;
};

smsAPI.prototype.password = function(password){
    if(typeof password === 'string')
        this.sender_config.password = password;
};

smsAPI.prototype.url = function(url){
    if(typeof url ==='string')
        this.config.url = url;
};

smsAPI.prototype.send = function(message, callback) {
    var request_params,
        status;

    extend(this.config.form, this.sender_config, message._data||message);
    request_params = this.config;


    if (!this._isValid(message)) {
        callback(new Error('smsapi-pl Sender: Username, password and receivers are required!'))
    } else {
        request.post(request_params,
            function (error, response, body) {
                error = handleErrors(error, body);

                if (!error)
                    status = body;

                callback(error, status);
            }
        );
    }

    this._clearForm();
    
};

smsAPI.prototype._isValid = function(message) {
    return typeof this.config.form.username === 'string' && typeof this.config.form.password === 'string' &&
        ((message._data && message._data.to)||message.to);
};

smsAPI.prototype._clearForm = function () {
    this.config.form = {};
};

module.exports = smsAPI;

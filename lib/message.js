'use strict';
var extend = require('extend'),
  _ = require('underscore');

var Message = function (options) {
  this._data = {};
  options ? extend(this._data, options) : null;
};

Message.prototype.to = function (number_or_numbers) {
  var receivers = this._data.to ? this._data.to : this._data.to = [];

  function isReceiverValid(receiver) {
    var clean_number = typeof receiver == 'string' || typeof receiver == 'number' ?
      parseInt(receiver).toString() : null;

    return clean_number ? clean_number.length == 11 || clean_number.length == 9 : null;
  }

  number_or_numbers instanceof Array ? receivers = receivers.concat(number_or_numbers) : receivers.push(number_or_numbers);

  receivers.length > 0 ? this._data.to = _.filter(receivers, isReceiverValid) : delete this._data.to;
  return this;

};

Message.prototype.params = function () {
  var self = this;

  function setParamObject(element, index) {
    var param_obj = {};
    param_obj['param' + (parseInt(index) + 1).toString()] = element;
    extend(self._data, param_obj);
  }

  _.each(arguments, setParamObject);
  return this;

};

Message.prototype.message = function (msg) {
  if (typeof msg == 'string') this._data.message = msg;
  return this;

};

Message.prototype.template = function (template) {
  this._data.template = template;
  return this;
};


Message.prototype.test = function () {
  this._data.test = 1;
  return this;
};

module.exports = Message;

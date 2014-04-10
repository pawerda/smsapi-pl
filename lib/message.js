var Message = function(options) {

    this.options = options;
    this.data = {};
    this.validation_data = {};


};





//Publics
Message.prototype.to = function(numbers){
    this.validation_data['to'] = numbers;
    if (this._isStringOrNumber(numbers) && this._isNumberValid(numbers)) {
        this.data['to'] = numbers;
    } else if (numbers instanceof Array) {
        this.data['to'] = new Array();
        for(var i = 0; i < numbers.length; i++){
            if (this._isStringOrNumber(numbers[i]) && this._isNumberValid(numbers[i])){
                this.data.to.push(parseInt(numbers[i]));
            }
        } 
    }  

};

Message.prototype.params = function(param1, param2, param3, param4){
    this.validation_data['parameters'] = new Array();
    this._setSingleParam(1, param1);
    this._setSingleParam(2, param2);
    this._setSingleParam(3, param3);
    this._setSingleParam(4, param4);

};

Message.prototype.message = function(msg){
    if(typeof msg == 'string'){
        this.data.message = msg;
    }
};

Message.prototype.template = function(template){
    this.data.template = template
};


Message.prototype.test = function(){
    this.data.test = 1;
};


//Privates
Message.prototype._setSingleParam = function(i, params){
    var param_name = new String('param' + i);
    if(params){
        this.validation_data.parameters.push(params.length);
        this.data[param_name] = params;
    }

};

Message.prototype._isStringOrNumber = function(x){
    if(typeof x == 'string' || typeof x == 'number')
        return true;
    return false;
};

Message.prototype._isNumberValid = function(number){
    if(parseInt(number).toString().length == 11 || parseInt(number).toString().length == 9)
        return true;
    return false;
};


Message.prototype._validate = function(){
    //this method will validate some of data
};



module.exports = Message;

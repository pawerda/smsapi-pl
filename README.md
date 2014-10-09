smsapi-pl
=========

Implementation of SMSAPI.pl for node.js
With this package you can easly send SMS by Polish provider www.smsapi.pl
Let's start short guide.

##Usage:
```text
$npm install smsapi-pl
```
####First example:
######Passing object to constructor. You can put everything what is provided by smsapi.pl for HTTPS protocol http://www.smsapi.pl/sms-api/interfejs-https

```javascript
var sms = require('smsapi-pl'),
    config = {
              username: 'your username',
              password: 'your_pass'
              };
              
var sender = new sms.API(config);
var msg = new sms.Message({
                       to: '+48500500500'
                       message: 'Hello world!'
                       });
                       
sender.send(msg, function(err, cb){
  if(err){
    console.log(err.message);
  } else {
    console.log(cb);
  }
});
```

####Second example 
######Using built-in methods or mixing with objects passed to constructors
```javascript
var sms = require('smsapi-pl'),
    sender = new sms.API({username: 'your username'}),
    numbers = ['+48500000000', 600000000, 48600000000];
    
var msg = new sms.Message({
                      from: 'some_name',
                      encoding: 'utf-8',
                      });
sender.password('your_password');

msg.to(numbers).template('new').test();
msg.params(['John','Maria','Whoever'], ['CP2255', 'CP2572', 'CP3673']);
                       
sender.send(msg, function(err, cb){
  if(err){
    console.log(err.message);
  } else {
    console.log(cb);
  }
});
```

###Implemented methods

####API (sender object from examples)

sender.**send(msg_object, callback)** - validates username and password existance, catches errors from error codes, sends it

sender.**username(username)** - username setter

sender.**password(password)** - password setter

sender.**url(url)** - api url request setter (default https://ssl.smsapi.pl/sms.do)

####Message (msg object from examples)
msg.**to(numbers)** - numbers: string, number or array. If number length != 9 or 11 ignores it.

msg.**message(some_message)** - message setter

msg.**test()** - dry run (simulates SMS sending)

msg.**template(template_name)** - template name setter (templates provided by smsapi.pl)

msg.**params(param1, param2, param3, param4)** - parameters: strings, numbers or arrays. Parameters for templates.


###TODO

Create methods for other options provided by smsapi.pl

Sending multiple messages

Data validation


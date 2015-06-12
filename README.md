smsapi-pl
=========

Implementation of SMSAPI.pl for node.js
With this package you can easly send SMS by Polish provider www.smsapi.pl
Version 0.1.0

##Usage:
```text
$npm install smsapi-pl
```
####then:

```javascript
var sms = require('smsapi-pl');
```

You can put anything provided by smsapi.pl for HTTPS protocol as objects
http://www.smsapi.pl/sms-api/interfejs-https

####First step:
######Create local sender object.

```javascript
var sender_config = {
        username: 'your username',
        password: 'your_pass'
        encoding: 'utf-8',
        normalize: 1
    },
    sender = new sms.API(sender_config);
    
    //This is local sender variable. 
    //You can set username and password later using build-in methods
```
######OR set app scope sender object

```javascript
sms.setSender(sender_config);
var sender = sms.sender;

    //sms.setSender is setting one sender instance for app scope as sms.sender
    //sms.sender is now sms.API instance 
    //require('smsapi-pl') has now your sender instance 
```
####Second step:
######Compose messages

```javascript
var msg_obj = {
    from: 'your_name',
    to: '+48500500500',
    message:'Hello world!'
};

    //OR

var msg = new sms.Message(msg_obj)

    //OR

var msg = new sms.Message();

msg.to(['+48500000000', 600000000, 48600000000]).template('new').test();
msg.params(['John','Maria','Whoever'], ['CP2255', 'CP2572', 'CP3673']);

    //creating Message instances is useful when you are sending arrays  
```

####Third step:
######Send it 


```javascript
sender.send(msg||msg_obj, function(err, response){
    console.log(err, response)
});

    //Doesnt matter if msg is raw object or Message instance
```

###Implemented methods

####API (sender object from examples)

sender.**send(msg_object, callback)** - validates username and password existance, catches errors

sender.**username(username)** - username setter

sender.**password(password)** - password setter

sender.**url(url)** - api url request setter (default https://ssl.smsapi.pl/sms.do)

####Message (msg object from examples)
msg.**to(numbers)** - numbers: string, number or array. If number length != 9 or 11 ignores it.

msg.**message(some_message)** - message setter

msg.**test()** - dry run (simulates SMS sending)

msg.**template(template_name)** - template name setter (templates provided by smsapi.pl)

msg.**params(*args)** - strings, numbers or arrays. Parameters for templates.



####Check test.js

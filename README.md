smsapi-pl
=========

Implementation of SMSAPI.pl for node.js
With this package you can easily send SMS by Polish provider www.smsapi.pl
Version 0.2.0

### news:
* send promise

## Usage:
```text
$npm install smsapi-pl
```
#### then:

```javascript
var sms = require('smsapi-pl');
```

You can put anything provided by smsapi.pl for HTTPS protocol
http://www.smsapi.pl/sms-api/interfejs-https

#### First step:

##### Create config object

```javascript
var senderConfig = {
    username: 'yourUsername',
    password: 'yourPass'
    encoding: 'utf-8',
    normalize: 1
};
```

##### Create local sender object.

```javascript
var sender = new sms.API(senderConfig)
```

##### OR set app scope sender object

```javascript

var sender = sms.setSender(senderConfig);

//sender == sms.sender // true
//sender instanceof sms.API //true
//every next require('smsapi-pl').sender is this sender object
```

#### Second step:

##### Compose messages

```javascript
var msgOptions = {
    from: 'yourName',
    to: '+48500500500',
    message:'Hello world!'
};

//OR

var msg = new sms.Message(msgOptions)

//OR

var msg = new sms.Message();

msg
  .to(['+48500000000', 600000000, 48600000000])
  .params(['John','Maria','Whoever'], ['CP2255', 'CP2572', 'CP3673']);
  .template('new')
  .test();
  
//creating Message instances is useful when you are sending arrays  
```

#### Third step:

##### Send it... 

It doesnt matter if you are sending Message instance or raw object. 

```javascript
sender.send(msg || msgOptions, function(err, response){
    console.log(err, response)
});
```

##### OR get send promise
```javascript
var sendPromise = sender.promise(msg || msgOptions)

```

### Implemented methods

#### API (sender object from examples)

* sender.**send(msg || msgObject, callback)** - validates username and password existance, catches errors
* sender.**promise(msg || msgObject)** - returns sender.**send** promise
* sender.**username('username')** - username setter
* sender.**password('password')** - password setter
* sender.**url('url')** - api url request setter (default https://ssl.smsapi.pl/sms.do)

#### Message (msg object from examples)

* msg.**to(numberOrNumbers)** - numbers: string, number or array. If number length != 9 or 11 ignores it.
* msg.**message('someMessage')** - message setter
* msg.**test()** - dry run (simulates SMS sending)
* msg.**template('templateName')** - template name setter (templates provided by smsapi.pl)
* msg.**params(*args)** - strings, numbers or arrays. Parameters for templates.

#### Check test.js

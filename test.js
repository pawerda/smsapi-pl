
var sms = require('./'),
    sender_config = {
        username: 'your_api_key',
        password: 'your_pass_here',
        encoding: 'utf-8',
        normalize: 1
    },
    sender = sms.setSender(sender_config),
    msg = new sms.Message();

//sms.setSender setting (and returning) one sender instance for app scope as sms.sender
//you can still create local senders using new sms.API()


// dry run without sending message
msg.test();
msg.to('number_string_or_array_here').message('Hello world!');

sender.send(msg, function(err, response){
    console.log(err, response)
});
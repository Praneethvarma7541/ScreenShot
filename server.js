 var connect = require('connect');
 serverStatic = require('serve-static');

 var app = connect();
	
 app.use(serverStatic(__dirname));
 app.listen(3000);
 console.log('Super boy');
// var connect = require('connect');
// var port = 3000;
// connect.createServer(
    // connect.static(__dirname)
// ).listen(port);
// console.log('Connected via port'+port);	
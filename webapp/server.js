// server.js

// set up ======================================================================
var express  = require('express');
var app      = express();
var server = require('http').createServer(app);
var port     = process.env.PORT || 8000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var io = require('socket.io').listen(server, { log: true });
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var nodemailer = require("nodemailer");
var configDB = require('./config/database.js');
var net = require('net');
var http = require('http');
var path = require('path');



// configuration ===============================================================
	mongoose.connect(configDB.url); // connect to our database

	require('./config/passport')(passport); // pass passport for configuration

	app.configure(function() {

		// set up our express application
		app.use(express.static(path.join(__dirname,'public')));
		app.use(express.logger('dev')); // log every request to the console
		app.use(express.cookieParser()); // read cookies (needed for auth)
		app.use(express.bodyParser()); // get information from html forms

		app.set('view engine', 'ejs'); // set up ejs for templating
		app.engine('html', require('ejs').renderFile);
		// required for passport
		app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
		app.use(passport.initialize());
		app.use(passport.session()); // persistent login sessions
		app.use(flash()); // use connect-flash for flash messages stored in session

	});

	// routes ======================================================================
	require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

var portName = '/dev/tty.usbserial-A501JUTF'; //var portName = '/dev/tty.usbmodem1421';
	

	var sp = new SerialPort(portName, {
		parser: serialport.parsers.readline("\r\n"),
		baudRate : 9600,
		dataBits : 8,
		parity : 'none',
		buffersize: 1024,
		stopBits: 1,
		flowControl : false,
	});

io.sockets.on('connection', function(socket, debug){
	if(debug == false){
	}

	socket.on('button', function(data){
		
		var status = data.lampstatus;

		//console.log('data dari web: '+ status);

		sp.open(function(){
			if (status == '1')
			{
				sp.write('1');
				//console.log(status);
			}
			else if (status == '2')
			{
				sp.write('2');
				//console.log(status);
				
			}
			else if (status == '3')
			{
				sp.write('3');
				//console.log(status);
			}
			else if (status == '4')
			{
				sp.write('4');
				//console.log(status);
				
			}
			else if (status == '5')
			{
				sp.write('5');
				//console.log(status);
			}
			else if (status == '6')
			{
				sp.write('6');
				//console.log(status);
				
			}
			else if (status == '7')
			{
				sp.write('7');
				//console.log(status);
			}
			else
			{
				sp.write('8');
				//console.log(status);
			}
		});
	});


	sp.on('data', function(data){
			var recdata = "";

			recdata = new Buffer(data, 'binary').toString('utf8');
			console.log('status  ' + recdata)

			if (recdata.indexOf('i') == 2 ){
				mailPlease();
				//console.log('email segera dikirim');
				recdata = "";
			}

			else if(recdata.indexOf('a') == 1 && recdata.indexOf('0') == 2){
				socket.emit('listrik', {listrikStatus:1});
				//console.log('ke web - lampu 1 mati ');
				recdata = "";
			}

			else if(recdata.indexOf('a') == 1 && recdata.indexOf('1') == 2 ){
				socket.emit('listrik', {listrikStatus:2});
				//console.log('ke web - lampu 1 hidup');
				recdata = "";
			}

			else if(recdata.indexOf('b') == 1 && recdata.indexOf('0') == 2){
				socket.emit('listrik', {listrikStatus:3});
				//console.log('ke web - lampu 2 mati');
				recdata = "";
			}

			else if(recdata.indexOf('b') == 1 && recdata.indexOf('1') == 2){
				socket.emit('listrik', {listrikStatus:4});
				//console.log('ke web - lampu 2 hidup');
				recdata = "";
			}

			else if(recdata.indexOf('c') == 1 && recdata.indexOf('0') == 2){
				socket.emit('listrik', {listrikStatus:5});
				//console.log('ke web - lampu 3 mati');
				recdata = "";
			}

			else if(recdata.indexOf('c') == 1 && recdata.indexOf('1') == 2){
				socket.emit('listrik', {listrikStatus:6});
				//console.log('ke web - lampu 3 hidup');
				recdata = "";
			}

			else if(recdata.indexOf('d') == 1 && recdata.indexOf('0') == 2){
				socket.emit('listrik', {listrikStatus:7});
				//console.log('ke web - lampu 4 mati');
				recdata = "";
			}

			else if(recdata.indexOf('d') == 1 && recdata.indexOf('1') == 2){
				socket.emit('listrik', {listrikStatus:8});
				//console.log('ke web - lampu 4 hidup');
				recdata = "";
			}
			else {
				return false
			}
		});
	
	socket.on('disconnect', function(){
		
		console.log('user disconnect');
	});
	
});

	

/*setInterval(function(){	
//Ping webcam IP untuk mengetahui status server
	var hosts = [['192.168.1.100', 8090], ['google.com', 80], ['google.com', 80]];
	hosts.forEach(function(item) {
	    var sock = new net.Socket();
	    sock.setTimeout(2500);
	    sock.on('connect', function() {
	        console.log(item[0]+':'+item[1]+' is up.');
	        sock.destroy();
	    })
	    .on('error', function(e) {
	        console.log(item[0]+':'+item[1]+' is down: ' + e.message);
	    })
	    .on('timeout', function(e) {
	        mailPlease();
	        console.log(item[0]+':'+item[1]+' is down: timeout');
	        
	    }).connect(item[1], item[0]);
	});
},50000);
*/


// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "",
        pass: ""
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: " Security <leopard891@gmail.com>", // sender address
    to: "leopard891@gmail.com", // list of receivers
    subject: "Something wrong in your home", // Subject line
    text: "See your Camera to see what happen", // plaintext body
    html: "<b>See your Camera</b>" // html body
}


function mailPlease(msg){
// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }
})

}


// launch ======================================================================
server.listen(port);
console.log('come and see at ' + port + ' :D');
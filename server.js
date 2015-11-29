var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var net = require('net');
//socket.io

var PORT = 3000;
var io = require('socket.io').listen(PORT);
//socket.io - fin
var client = new net.Socket();
client.connect(35639, '54.235.132.133', function() {
	console.log('Connected');
	client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	io.sockets.emit("message_res", data.toString());
	//client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});
//socket.io

io.on('connection',function(socket){
	console.log("Conectado socket.io");
	//io.sockets.emit("message_res", "Hola desde el servidor TCP");
	//socket.emit("message_res", "Hola desde el servidor TCP");
	//socket.broadcast.emit("message_res", "Hola desde el servidor TCP");
	socket.on('message_req', function(dt){
		client.write(dt);
		//socket.emit("message_res", "Hola desde el servidor TCP");
        //socket.broadcast.emit("message_res", "Hola desde el servidor TCP");
    });
});
rl.on('line', function(dt){
	client.write(dt.toString());
});

console.log("Client TCP...");

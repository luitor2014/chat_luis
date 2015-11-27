/**
 * Created by sreejeshpillai on 09/05/15.
 */
var express  = require('express');
var app = express();
var path = require('path');
var cons= require('consolidate');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = 51327;
//var PORT = process.env.PORT;
app.engine('.jade',cons.jade);
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', scripts: ['javascripts/script.js']});
});



var obj_user = new Object();
var usuario = {};
io.on('connection',function(socket){
    //desde la web
    //vemos si existen
    var room = io.sockets.connected;
    
    //fin del vemos si existen
    
    // console.log("server: "+io.sockets.connected[0]);
    console.log("conect: "+socket.id);
    // console.log(io.sockets.server.eio.clientsCount);
    socket.on('message_req', function(dt){
        
        socket.broadcast.emit("message_res", {nickname: usuario[socket.id], text: dt.text+" :port heroku: "+PORT, id_user: socket.id});
        // console.log(socket.id);
        // io.sockets.emit('saludo_res','hola');
        console.log(dt.text);
    });

    socket.on('nickname', function (dt) {
        usuario[socket.id] = dt.nickname;

        obj_user.action = "add";
        obj_user.id_user = socket.id;
        obj_user.nombre = usuario[socket.id];

        io.sockets.emit('usuarios_res', obj_user);

        console.log("Conectado: "+usuario[socket.id]);
        //refrescamos todos los usuarios solo para ese usuario que recien ingresa
        if (room) {
            for (var id in room) {
                if( usuario[id] && socket.id !=  id ){
               // console.log( "dead: "+id );
                   socket.emit('usuarios_res', {
                        action: "add",
                        id_user: id,
                        nombre: usuario[id]
                    });
                   console.log(usuario[id]);
                } 
            }
            
        }
      });
    
    socket.on('disconnect',function(){
        obj_user.action = "delete";
        obj_user.id_user = socket.id;
        obj_user.nombre = usuario[socket.id];

        io.sockets.emit('usuarios_res', obj_user);

        console.log('one user disconnected '+usuario[socket.id]);
    });
});

http.listen(PORT,function(){
    console.log('server listening on port '+PORT);
});

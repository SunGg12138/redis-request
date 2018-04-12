const Redis = require('ioredis');
const socketIo = require('socket.io');
const server = require('http').createServer();
const RedisRequest = require('../../index');
const redisRequest = RedisRequest(new Redis(), new Redis());
redisRequest.extends({ emit: require('../extends/emit') });
redisRequest.onerror = function(){};

let port = 12000 + Number(process.argv[2]);

global.io = socketIo(server);
io.on('connection', function(socket){
  socket.join('test room');
  socket.on('test', function(data){
    redisRequest.emit(socket.id, 'test', data);
  });
});
server.listen(port, function(){
  var socket = require('socket.io-client')('http://127.0.0.1:' + port, {
    reconnection: false
  });
  socket.on('connect', function(){
    if (process.argv[2] === '2') {
      setTimeout(function(){
        socket.emit('test', {
          message: 'I get it.'
        });
      }, 500);
    }
  });
  socket.on('test', function(data){
    console.log(JSON.stringify(data));
    process.exit(0);
  });
  socket.on('error', function(){
    process.exit(0);
  });
  socket.on('disconnect', function(){
    process.exit(0);
  });
  setTimeout(function(){
    process.exit(0);
  }, 2000);
});
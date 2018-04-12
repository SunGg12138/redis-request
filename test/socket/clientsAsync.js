const Redis = require('ioredis');
const socketIo = require('socket.io');
const server = require('http').createServer();
const RedisRequest = require('../../index');
const redisRequest = RedisRequest(new Redis(), new Redis());
redisRequest.extends({ clientsAsync: require('../extends/clientsAsync') });
redisRequest.onerror = function(){};

let port = 12000 + Number(process.argv[2]);

global.io = socketIo(server);
io.on('connection', function(socket){
  socket.join('test room');
  socket.on('test', function(){
    redisRequest.clientsAsync('test room').then(function(data){
      console.log(JSON.stringify(data));
      process.exit(0);
    }, function(err){
      console.log(err);
    });
  });
});
server.listen(port, function(){
  var socket = require('socket.io-client')('http://127.0.0.1:' + port, {
    reconnection: false
  });
  socket.on('connect', function(){
    if (process.argv[2] === '2') {
      setTimeout(function(){
        socket.emit('test');
      }, 500);
    }
  });
  setTimeout(function(){
    process.exit(0);
  }, 2000);
});
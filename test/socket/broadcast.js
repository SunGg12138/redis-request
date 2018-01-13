const Redis = require('ioredis');
const socketIo = require('socket.io');
const server = require('http').createServer();
const RedisRequest = require('../../index');
const redisRequest = RedisRequest(new Redis(), new Redis());
redisRequest.extends({ broadcast: require('../extends/broadcast') });

let port = 8000 + Number(process.argv[2]);

global.io = socketIo(server);
io.on('connection', function(socket){
    socket.join('test room');
    socket.on('test', function(data){
        redisRequest.broadcast('test', data);
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
});
# redis-request

I'm now using it to deal with the socket multi process problem.

## Install

```javascript
npm install redis-request
```

## How to use

The example for socket.io multi process broadcast.

```javascript
// /socket/broadcast.js
function broadcast(emitType, data){
    broadcast.send({ type: broadcast.type, emitType, data });
}
broadcast.onmessage = function(message){
    io.emit(message.emitType, message.data);
}
module.exports = broadcast;

// redisRequest.js
const Redis = require('ioredis');
const RedisRequest = require('redis-request');
const redisRequest = RedisRequest(new Redis(), new Redis());
redisRequest.extends({ broadcast: require('./socket/broadcast') });
module.exports = redisRequest;

// index.js
const redisRequest = require('./redisRequest');
redisRequest.broadcast('join', {
    username: 'abcd',
    sex: 1,
    avatar: '...'
    ...
});
```

It's just simple.

The example for socket.io multi process get user information list.

```javascript
// /socket/getUserList.js
function getUserList(room, fn){
    getUserList.request({ type: getUserList.type, room }, fn);
}
getUserList.onmessage = function(message){
    io.of(message.room).clients((error, clients) => {
        if (error) throw error;
        let data = [];
        for (let i = 0; i < clients.length; i++) {
            let socket = io.sockets.sockets[clients[i]];
            if (!socket) continue;
            data.push({
                socketId: socket.id,
                userName: socketId.user.userName,
                avatar: socketId.user.avatar,
                sex: socketId.user.sex
            });
        }
        getUserList.response({
            type: getUserList.type,
            requestId: message.requestId,
            data: data
        });
    });
}
getUserList.oncollect = function(message){
    let request = getUserList.requests[message.requestId];
    request.msgCount++;

    // Collect the results of all processes
    request.data = request.data || [];
    request.data.concat(message.data);
    
    if (request.msgCount === request.numsub) {
        request.callback && request.callback(null, request.data)
        clearTimeout(request.timeout);
        delete getUserList.requests[message.requestId];
    }
}
module.exports = getUserList;

// redisRequest.js
const Redis = require('ioredis');
const RedisRequest = require('redis-request');
const redisRequest = RedisRequest(new Redis(), new Redis());
redisRequest.extends({ getUserList: require('./socket/getUserList') });
module.exports = redisRequest;

// index.js
const redisRequest = require('./redisRequest');
redisRequest.getUserList('room_id', function(err, list){
    // list is user information list.
});
```
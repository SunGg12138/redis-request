# redis-request

I'm now using it to deal with the socket multi process problem.

## Install

```base
$ npm install redis-request
```

## How to use

```javascript
const RedisRequest = require('redis-request');
const redisRequest = RedisRequest(new Redis(), new Redis());
redisRequest.extends({ broadcast: require('./test/extends/broadcast') });

redisRequest.onerror = function(error){
  console.log(error);
};

// 所有进程都能收到这次广播事件，redisRequest.broadcast.onmessage可以收到事件
redisRequest.broadcast('join', { userName: '小王', user_id: '123456789', sex: 0 });
```

## Document

[更多](https://github.com/SunGg12138/redis-request/blob/master/docs/)

## Example

The example for socket.io multi process.

1. [socket.io clients](https://github.com/SunGg12138/redis-request/blob/master/test/extends/clients.js)

2. [socket.io broadcast](https://github.com/SunGg12138/redis-request/blob/master/test/extends/broadcast.js)

3. [socket.io emit](https://github.com/SunGg12138/redis-request/blob/master/test/extends/emit.js)

4. [socket.io clientsAsync](https://github.com/SunGg12138/redis-request/blob/master/test/extends/clientsAsync.js)

## Test

```base
$ mocha
```

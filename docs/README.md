## 共有3中发送消息的方法

1. 简单的发送消息，不求回应

```javascript

// 使用.send方法，会触发每个进程的onmessage事件

function broadcast(emitType, data){
  broadcast.send({ type: broadcast.type, emitType, data });
}
broadcast.onmessage = function(message){
  io.emit(message.emitType, message.data);
}
module.exports = broadcast;

```

2. 发送消息，需要回应数据

```javascript

// 使用.request方法，会触发每个进程的onmessage方法
// 在onmessage方法中使用response返回本进程的数据
// 每次收到进程的回复消息会触发发出请求进程的.oncollect方法，把每个进程的数据收集起来
// 使用isAll方法判断是否所有进程都返回了值并在为true时执行这次回调函数

function clients(room, callback){
  clients.request({ type: clients.type, room }, callback);
}
clients.onmessage = function(message){
  io.to(message.room).clients(function(err, clientIds){
    if (err) {
      console.log(err);
    } else {
      // response old message and new message
      clients.response(message, { data: clientIds });
    }
  });
}
clients.oncollect = function(message, request){
  request.data = request.data || [];
  request.data = request.data.concat(message.data);
  if (clients.isAll(message.requestId)) {
    request.callback && request.callback(null, request.data);
  }
}
module.exports = clients;

```

3. 发送消息，需要回应数据，异步请求

```javascript

// 使用.requestAsync方法
// 使用方法与.request一样

function clients(room){
  return clients.requestAsync({ type: clients.type, room });
}
clients.onmessage = function(message){
  io.to(message.room).clients(function(err, clientIds){
    if (err) {
      console.log(err);
    } else {
      // response old message and new message
      clients.response(message, { data: clientIds });
    }
  });
}
clients.oncollect = function(message, request){
  request.data = request.data || [];
  request.data = request.data.concat(message.data);
  if (clients.isAll(message.requestId)) {
    request.callback && request.callback(null, request.data);
  }
}
module.exports = clients;

```
function emit(socketId, emitType, data){
  emit.send({ type: emit.type, socketId, emitType, data });
}
emit.onmessage = function(message){
  let socket = io.sockets.sockets[message.socketId];
  if (socket) socket.emit(message.emitType, message.data);
}
module.exports = emit;
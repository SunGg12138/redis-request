function broadcast(emitType, data){
    broadcast.send({ type: broadcast.type, emitType, data });
}
broadcast.onmessage = function(message){
    io.emit(message.emitType, message.data);
}
module.exports = broadcast;
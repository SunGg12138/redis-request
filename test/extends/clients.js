function clients(room, callback){
    clients.request({ type: clients.type, room }, callback);
}
clients.onmessage = function(message){
    io.to(message.room).clients(function(err, clientIds){
        if (err) {
            console.log(err);
        } else {
            clients.response({
                type: clients.type,
                requestId: message.requestId,
                data: clientIds
            });
        }
    });
}
clients.oncollect = function(message, request){
    request.data = request.data || [];
    request.data = request.data.concat(message.data);
    if (clients.isReady(message.requestId)) {
        request.callback && request.callback(null, request.data);
    }
}
module.exports = clients;
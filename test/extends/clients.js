function clients(room, fn){
    clients.request({ type: clients.type, room }, fn);
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
clients.oncollect = function(message){
    let request = clients.requests[message.requestId];
    request.msgCount++;

    
    request.data = request.data || [];
    request.data = request.data.concat(message.data);

    if (request.msgCount === request.numsub) {
        request.callback && request.callback(null, request.data)
        clearTimeout(request.timeout);
        delete clients.requests[message.requestId];
    }
}
module.exports = clients;
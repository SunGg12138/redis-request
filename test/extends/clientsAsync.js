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
        request.resolve(request.data)
    }
}
module.exports = clients;
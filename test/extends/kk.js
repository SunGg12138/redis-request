function kk(data, fn){
    kk.request({ type: kk.type, data }, fn);
}
kk.onmessage = function(message){
    // The process accepts the request and returns the result after processing

    let random = Math.random();

    kk.response({
        type: kk.type,
        requestId: message.requestId,
        data: 'response ' + kk.type + ': ' + random * message.data
    });
}
kk.oncollect = function(message){
    let request = kk.requests[message.requestId];
    request.msgCount++;

    // Collect the results of all processes
    request.data = request.data || [];
    request.data.push(message.data);
    
    if (request.msgCount === request.numsub) {
        request.callback && request.callback(null, request.data)
        clearTimeout(request.timeout);
        delete kk.requests[message.requestId];
    }
}
module.exports = kk;
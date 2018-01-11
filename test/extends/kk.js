function kk(data, fn){
    kk.redisRequest.publish({ type: 'kk.cc', data }, fn);
}
kk.request = function(message){
    // The process accepts the request and returns the result after processing

    let random = Math.random();

    // Publish the process's result
    kk.redisRequest.pub.publish(kk.redisRequest.resChannel, JSON.stringify({
        type: 'kk.cc',
        requestId: message.requestId,
        data: 'response kk.cc: ' + random * message.data
    }));
}
kk.response = function(message){
    let request = kk.redisRequest.requests[message.requestId];
    request.msgCount++;

    // Collect the results of all processes
    request.data = request.data || [];
    request.data.push(message.data);
    
    if (request.msgCount === request.numsub) {
        request.callback && request.callback(null, request.data)
        clearTimeout(request.timeout);
        delete kk.redisRequest.requests[message.requestId];
    }
}
module.exports = kk;
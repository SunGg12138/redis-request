function kk(data, fn){
    this.publish({ type: 'kk', data }, fn);
}
kk.request = function(message){
    // The process accepts the request and returns the result after processing

    let random = Math.random();

    // Publish the process's result
    this.pub.publish(this.resChannel, JSON.stringify({
        type: 'kk',
        requestId: message.requestId,
        data: 'response kk: ' + random * message.data
    }));
}
kk.response = function(message){
    let request = this.requests[message.requestId];
    request.msgCount++;

    // Collect the results of all processes
    request.data = request.data || [];
    request.data.push(message.data);
    
    if (request.msgCount === request.numsub) {
        request.callback && request.callback(null, request.data)
        clearTimeout(request.timeout);
        delete this.requests[message.requestId];
    }
}
module.exports = kk;
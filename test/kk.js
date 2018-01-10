module.exports = {
    request: function(message){
        this.pub.publish(this.resChannel, JSON.stringify({
            type: 'kk',
            requestId: message.requestId,
            data: 'response 1231321'
        }));
    },
    response: function(message){
        let request = this.requests[message.requestId];
        request.msgCount++;

        request.data = request.data || [];
        request.data.push(message.data);
        
        if (request.msgCount === request.numsub) {
            request.callback && request.callback(null, request.data)
            clearTimeout(request.timeout);
            delete this.requests[message.requestId];
        }
    },
    send: function(data, fn){
        this.publish({ type: 'kk', data }, function(err, data){
            console.log(err);
            console.log(data);
        });
    }
};
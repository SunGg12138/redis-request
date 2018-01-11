const uid2 = require('uid2');

module.exports = request;

function request(data, requestsTimeout, fn){

    let requestId = uid2(8);

    data.requestId = requestId;

    if (typeof requestsTimeout === 'function') fn = requestsTimeout;
    if (typeof requestsTimeout !== 'number') requestsTimeout = 6000;

    this.pub.send_command('pubsub', ['numsub', this.reqChannel], function(err, numsub){
        if (err) {
            if (fn) fn(err);
            return;
        }

        numsub = parseInt(numsub[1], 10);

        let timeout = setTimeout(function(){
            let request = this.requests[requestId];
            request.callback && request.callback('The "kk" request timeout', request);
            delete this.requests[requestId];
        }.bind(this), requestsTimeout);
    
        this.requests[requestId] = {
            type: 'kk',
            numsub: numsub,
            msgCount: 0,
            callback: fn,
            timeout: timeout
        };
        this.pub.publish(this.reqChannel, JSON.stringify(data));
    }.bind(this));
}
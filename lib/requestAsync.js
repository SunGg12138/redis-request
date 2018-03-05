const uid2 = require('uid2');

module.exports = request;

function request(data, requestsTimeout){

    let requestId = uid2(8);

    data.requestId = requestId;

    if (typeof requestsTimeout !== 'number') requestsTimeout = 6000;

    return new Promise((resolve, reject) => {
        this.pub.send_command('pubsub', ['numsub', this.reqChannel], function(err, numsub){
            if (err) {
                reject(err);
                return;
            }
    
            numsub = parseInt(numsub[1], 10);
    
            let timeout = setTimeout(function(){
                let request = this.requests[requestId];
                reject('Error: A request timeout', request)
                delete this.requests[requestId];
            }.bind(this), requestsTimeout);
        
            this.requests[requestId] = {
                type: data.type,
                numsub: numsub,
                msgCount: 0,
                resolve: resolve,
                timeout: timeout
            };
            this.pub.publish(this.reqChannel, JSON.stringify(data));
        }.bind(this));
    });
}
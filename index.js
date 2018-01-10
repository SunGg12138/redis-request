const publish = require('./lib/publish');
const onrequest = require('./lib/onrequest');
const onresponse = require('./lib/onresponse');

function redisRequest(sub, pub, prefix){

    this.reqChannel = prefix + 'req#';
    this.resChannel = prefix + 'res#';

    sub.subscribe([this.reqChannel, this.resChannel], function(err){
        if (err) console.log(err);
    });

    sub.on('message', function(channel, message){
        try {
            message = JSON.parse(message);
        } catch(error) {
            console.log(error);
            return;
        }
        channel = channel.split('#');
        if (channel[1] === 'req') {
            this.onrequest(message);
        } else if (channel[1] === 'res'){
            this.onresponse(message);
        }
    }.bind(this));

    sub.on('error', console.log);
    pub.on('error', console.log);

    this.sub = sub;
    this.pub = pub;

    this.requests = {};

    this.reservedWords = [ 'resChannel', 'reqChannel', 'sub', 'pub', 'requests', 'extends', 'reservedWords' ];
}

redisRequest.prototype.publish = publish;
redisRequest.prototype.onrequest = onrequest;
redisRequest.prototype.onresponse = onresponse;
redisRequest.prototype.extends = function(objs){
    this.reservedWords.forEach(item => {
        if (objs[item]) {
            delete objs[item];
            console.log(`The "${item}" is reserved word!`);
        }
    });
    for (let key in objs) {
        this[key] = objs[key];
        this[key].send.bind(this);
    }
};

module.exports = function(sub, pub, prefix){
    prefix = prefix || 'redis-request#';
    if (!sub || !pub) throw new Error('The sub and the pub is required');
    return new redisRequest(sub, pub, prefix);
}
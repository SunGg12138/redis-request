'use strict';
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
}

redisRequest.prototype.publish = publish;
redisRequest.prototype.onrequest = onrequest;
redisRequest.prototype.onresponse = onresponse;
redisRequest.prototype.extends = function(obj, extend){
    if (!extend) {
        extend = obj;
        obj = this;
    }
    if (typeof extend === 'function') {
        let name = extend.name;
        if (!name) return;
        obj[name] = extend;
        obj[name].redisRequest = this;
    } else if (typeof extend === 'object') {
        for (let key in extend) {
            if (typeof extend[key] === 'function') {
                obj[key] = extend[key];
                obj[key].redisRequest = this;
            } else if (typeof extend[key] === 'object') {
                obj[key] = {};
                this.extends(obj[key], extend[key]);
            }
        }
    }
};

module.exports = function(sub, pub, prefix){
    prefix = prefix || 'redis-request#';
    if (!sub || !pub) throw new Error('The sub and the pub is required');
    return new redisRequest(sub, pub, prefix);
}
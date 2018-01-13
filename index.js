'use strict';
const send = require('./lib/send');
const request = require('./lib/request');
const response = require('./lib/response');
const onrequest = require('./lib/onrequest');
const onresponse = require('./lib/onresponse');
const Extends = require('./lib/extends');

function redisRequest(sub, pub, prefix){

    this.reqChannel = prefix + 'req#';
    this.resChannel = prefix + 'res#';

    sub.subscribe([this.reqChannel, this.resChannel], function(err){
        if (err) this.onerror(err);
    }.bind(this));

    sub.on('message', function(channel, message){
        try {
            message = JSON.parse(message);
        } catch(error) {
            this.onerror(error);
            return;
        }
        channel = channel.split('#');
        if (channel[1] === 'req') {
            this.onrequest(message);
        } else if (channel[1] === 'res'){
            this.onresponse(message);
        }
    }.bind(this));

    sub.on('error', this.onerror);
    pub.on('error', this.onerror);

    this.sub = sub;
    this.pub = pub;

    this.requests = {};
}

redisRequest.prototype.send = send;
redisRequest.prototype.request = request;
redisRequest.prototype.response = response;
redisRequest.prototype.onrequest = onrequest;
redisRequest.prototype.onresponse = onresponse;
redisRequest.prototype.extends = Extends;
redisRequest.prototype.disconnect = function(){
    this.sub.disconnect();
    this.pub.disconnect();
};
redisRequest.prototype.onerror = function(error){};

module.exports = function(sub, pub, prefix){
    prefix = prefix || 'redis-request#';
    if (!sub || !pub) throw new Error('The sub and the pub is required');
    return new redisRequest(sub, pub, prefix);
}
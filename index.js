'use strict';
const send = require('./lib/send');
const request = require('./lib/request');
const response = require('./lib/response');
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

redisRequest.prototype.send = send;
redisRequest.prototype.request = request;
redisRequest.prototype.response = response;
redisRequest.prototype.onrequest = onrequest;
redisRequest.prototype.onresponse = onresponse;
redisRequest.prototype.extends = function(obj, extend, prefix){
    if (!extend) {
        extend = obj;
        obj = this;
        prefix = '';
    }
    if (typeof extend === 'function') {
        let name = extend.name;
        if (!name) return;
        obj[name] = extend;
        obj[name].__proto__ = this;
        obj[name].type = prefix + name;
    } else if (typeof extend === 'object') {
        for (let key in extend) {
            if (typeof extend[key] === 'function') {
                obj[key] = extend[key];
                obj[key].__proto__ = this;
                obj[key].type = prefix + '.' + key;
                obj[key].onmessage && (obj[key].onmessage.type = prefix + '.' + key);
            } else if (typeof extend[key] === 'object') {
                obj[key] = {};
                this.extends(obj[key], extend[key], prefix? prefix + '.' + key : prefix + key);
            }
        }
    }
};

module.exports = function(sub, pub, prefix){
    prefix = prefix || 'redis-request#';
    if (!sub || !pub) throw new Error('The sub and the pub is required');
    return new redisRequest(sub, pub, prefix);
}
'use strict';
const send = require('./lib/send');
const request = require('./lib/request');
const requestAsync = require('./lib/requestAsync');
const response = require('./lib/response');
const onrequest = require('./lib/onrequest');
const onresponse = require('./lib/onresponse');
const Extends = require('./lib/extends');

function redisRequest(sub, pub, prefix){

  // 设置请求和响应的redis频道前缀
  this.reqChannel = prefix + 'req#';
  this.resChannel = prefix + 'res#';

  // 订阅请求和响应的频道
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
redisRequest.prototype.requestAsync = requestAsync;
redisRequest.prototype.response = response;
redisRequest.prototype.onrequest = onrequest;
redisRequest.prototype.onresponse = onresponse;
redisRequest.prototype.extends = Extends;

// 在oncollect时判断是否所有进程都响应了请求
redisRequest.prototype.isAll = function(requestId){
  let request = this.requests[requestId];
  if (!request) return true;
  if (request.msgCount === request.numsub) {
    clearTimeout(request.timeout);
    delete this.requests[requestId];
    return true;
  } else {
    return false;
  }
};

// 清理requestId对应的请求ID和计时器
redisRequest.prototype.clearRequest = function(requestId){
  let request = this.requests[requestId];
  if (!request) return;
  clearTimeout(request.timeout);
  delete this.requests[requestId];
};

// 断开redis连接
redisRequest.prototype.disconnect = function(requestId){
  this.sub.disconnect();
  this.pub.disconnect();
};

// 错误监听
redisRequest.prototype.onerror = function(error){
  throw error;
};

/**
 * 创建redisRequest
 * 
 * @param {*} sub 订阅的redis
 * @param {*} pub 发布的redis
 * @param {*} prefix 订阅和发布事件的前缀，默认为redis-request#
 */
module.exports = function(sub, pub, prefix){
  prefix = prefix || 'redis-request#';
  if (!sub || !pub) throw new Error('The sub and the pub is required');
  return new redisRequest(sub, pub, prefix);
}
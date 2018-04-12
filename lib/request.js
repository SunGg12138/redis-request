const uid2 = require('uid2');

module.exports = request;

/**
 * 发送消息，每个进程都需要回复
 * 
 * @param {Object} data 发送消息的内容
 * @param {Number} requestsTimeout 设定超时时间
 * @param {Function} fn 回调函数
 */
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
      request.callback && request.callback('Error: A request timeout', request);
      delete this.requests[requestId];
    }.bind(this), requestsTimeout);
  
    this.requests[requestId] = {
      type: data.type,
      numsub: numsub,
      msgCount: 0,
      callback: fn,
      timeout: timeout
    };
    this.pub.publish(this.reqChannel, JSON.stringify(data));
  }.bind(this));
}
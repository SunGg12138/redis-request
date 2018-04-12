module.exports = onresponse;

/**
 * 扩展对象中监听的事件，当收到响应时
 * 
 * @param {Object} message 响应的信息
 */
function onresponse(message){
  let { type, requestId } = message,
      request = this.requests[requestId];
  
  if (!type || !requestId || !request) return;

  try {
    let typeObj = eval('this' + type);
    request.msgCount++;
    typeObj.oncollect.call(this, message, request);
  } catch (error) {
    this.onerror(error);
  }
}
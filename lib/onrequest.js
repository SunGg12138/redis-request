module.exports = onrequest;

/**
 * 扩展对象中监听的事件，当收到请求时
 * 
 * @param {Object} message 请求的信息
 */
function onrequest(message){

  // 请求时必须带时类型，否则忽略
  if (!message.type) return;

  try {
    let typeObj = eval('this' + message.type);
    if (!typeObj) return;
    typeObj.onmessage.call(this, message);
  } catch (error) {
     this.onerror(error);
  }
}
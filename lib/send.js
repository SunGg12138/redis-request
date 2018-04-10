module.exports = send;

/**
 * 简单的发送消息，不需要回复
 * 
 * @param {Object} data 发送消息的内容
 */
function send(data){
    this.pub.publish(this.reqChannel, JSON.stringify(data));
}
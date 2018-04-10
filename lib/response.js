const _ = require('lodash');

module.exports = response;

/**
 * 当收到message事件后，回复消息
 * 
 * @param {Object} oldMsg message事件获得的原始消息
 * @param {*} data 要回复的内容
 */
function response(oldMsg, data){
    this.pub.publish(this.resChannel, JSON.stringify(_.merge(oldMsg, data)));
}
const uid2 = require('uid2');

module.exports = requestAsync;

/**
 * 发送消息，每个进程都需要回复（就是在request基础上封装了一下）
 * 
 * @param {Object} data 发送消息的内容
 * @param {Number} requestsTimeout 设定超时时间
 * @return {Promise}
 */
function requestAsync(data, requestsTimeout){
    return new Promise((resolve, reject) => {
        this.request(data, requestsTimeout, function(err, data){
            if (err) reject(err);
            else resolve(data);
        });
    });
}
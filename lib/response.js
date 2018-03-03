const _ = require('lodash');

module.exports = response;

function response(oldMsg, data){
    // Publish the process's result
    this.pub.publish(this.resChannel, JSON.stringify(_.merge(oldMsg, data)));
}
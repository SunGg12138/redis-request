module.exports = response;

function response(data){
    // Publish the process's result
    this.pub.publish(this.resChannel, JSON.stringify(data));
}
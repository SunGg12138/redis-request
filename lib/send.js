module.exports = send;

function send(data){
    this.pub.publish(this.reqChannel, JSON.stringify(data));
}
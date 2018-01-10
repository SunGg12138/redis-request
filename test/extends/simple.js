function simple(data, fn){
    this.pub.publish(this.reqChannel, JSON.stringify({ type: 'simple', data }));
}
simple.request = function(message){
    let random = Math.random();
    console.log('request simple: ' + random * message.data);
}
module.exports = simple;
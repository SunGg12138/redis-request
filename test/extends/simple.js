function simple(data){
    simple.send({ type: 'simple', data });
    console.log(simple.type)
}
simple.onmessage = function(message){
    let random = Math.random();
    console.log('request simple: ' + random * message.data);
}
module.exports = simple;
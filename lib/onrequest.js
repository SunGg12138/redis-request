module.exports = onrequest;

function onrequest(message){
    let { type } = message;
    if (!type || !this[type]) return;

    this[type].request.call(this, message);
}
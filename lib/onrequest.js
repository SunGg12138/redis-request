module.exports = onrequest;

function onrequest(message){
    let { type, requestId } = message;
    if (!type || !requestId || !this[type]) return;

    this[type].request.call(this, message);
}
module.exports = onresponse;

function onresponse(message){
    let { type, requestId } = message;
    if (!type || !requestId || !this[type] || !this.requests[requestId]) return;

    this[type].response.call(this, message);
}
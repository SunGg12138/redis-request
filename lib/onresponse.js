module.exports = onresponse;

function onresponse(message){
    let { type, requestId } = message,
        request = this.requests[requestId];
    if (!type || !requestId || !request) return;

    try {
        let typeObj = eval('this' + type);
        request.msgCount++;
        typeObj.oncollect.call(this, message, request);
    } catch (error) {
        this.onerror(error);
    }
}
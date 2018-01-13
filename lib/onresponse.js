module.exports = onresponse;

function onresponse(message){
    let { type, requestId } = message;
    if (!type || !requestId || !this.requests[requestId]) return;

    try {
        let typeObj = eval('this' + type);
        typeObj.oncollect.call(this, message);
    } catch (error) {
        this.onerror(error);
    }
}
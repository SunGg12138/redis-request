module.exports = onrequest;

function onrequest(message){
    if (!message.type) return;

    try {
        let typeObj = eval('this.' + message.type);
        if (!typeObj) return;
        typeObj.onmessage.call(this, message);
    } catch (error) {
        console.log(error);
    }
}
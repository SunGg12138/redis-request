module.exports = Extends;

function Extends(obj, extend, prefix){
    if (!extend) {
        extend = obj;
        obj = this;
        prefix = '';
    }
    if (typeof extend === 'function') {
        let name = extend.name;
        if (!name) return;
        obj[name] = extend;
        obj[name].__proto__ = this;
        obj[name].type = prefix + '.' + name;
    } else if (typeof extend === 'object') {
        for (let key in extend) {
            if (typeof extend[key] === 'function') {
                obj[key] = extend[key];
                obj[key].__proto__ = this;
                obj[key].type = prefix + '.' + key;
                obj[key].onmessage && (obj[key].onmessage.type = prefix + '.' + key);
            } else if (typeof extend[key] === 'object') {
                obj[key] = {};
                this.extends(obj[key], extend[key], prefix + '.' + key);
            }
        }
    }
}
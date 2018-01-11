let xx = {xx: function(){
    console.log('xx')
}};

function extend(obj, extend) {
    if (!extend) {
        extend = obj;
        obj = xx;
    }
    if (typeof extend === 'function') {
        let name = extend.name;
        if (!name) return;
        obj[name] = extend;
        obj[name].bind(this);
    } else if (typeof extend === 'object') {
        for (let key in extend) {
            obj[key] = {};
            arguments.callee(obj[key], extend[key]);
        }
    }
}

extend({
    A: {
        a: function(){
            console.log('a')
        },
        b: function(){
            console.log('b')
        }
    },
    B: function(){
        console.log('B')
    },
    C: {
        a3: function(){
            console.log('a3')
        },
        b3: {
            kk: function(){
                console.log('kk')
            }
        }
    }
});

console.log(xx)
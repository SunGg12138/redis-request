module.exports = Extends;

/**
 * 为redis-request扩展方法
 * 
 * @param {Object} obj 在这个对象的基础上扩展（默认是this）
 * @param {Object} extend 要扩展的对象
 * @param {String} prefix 本次扩展的前缀
 */
function Extends(obj, extend, prefix){
  if (!extend) {
    extend = obj, obj = this, prefix = '';
  }
  if (typeof extend === 'object') {
    for (let key in extend) {
      if (typeof extend[key] === 'function') {
        obj[key] = extend[key];
        obj[key].type = prefix + '.' + key;
        obj[key].__proto__ = obj[key]._origin = this;
        obj[key].onmessage && (obj[key].onmessage.type = prefix + '.' + key);
      } else if (typeof extend[key] === 'object') {
        obj[key] = {};
        this.extends(obj[key], extend[key], prefix + '.' + key);
      }
    }
  } else {
    throw 'An object to be extended must be an object type';
  }
}
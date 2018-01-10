const Redis = require('ioredis');
const RedisRequest = require('../index');
const redisRequest = RedisRequest(new Redis(), new Redis());
redisRequest.extends({ kk: require('./extends/kk') });

// send message
redisRequest.kk(100, function(err, data){
    // data is result of all process
    console.log(err, data);
});
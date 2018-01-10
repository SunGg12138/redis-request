const Redis = require('ioredis');
const RedisRequest = require('../index');

const redisRequest = RedisRequest(new Redis(), new Redis());

redisRequest.extends({ kk: require('./kk') });

redisRequest.kk.send.call(redisRequest, '121381234');
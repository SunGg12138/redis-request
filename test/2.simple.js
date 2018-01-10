const Redis = require('ioredis');
const RedisRequest = require('../index');
const redisRequest = RedisRequest(new Redis(), new Redis());
redisRequest.extends({ simple: require('./extends/simple') });

redisRequest.simple(100);
const Redis = require('ioredis');
const RedisRequest = require('../index');
const redisRequest = RedisRequest(new Redis(), new Redis());
redisRequest.extends(require('./extends/simple'));

redisRequest.simple(100);
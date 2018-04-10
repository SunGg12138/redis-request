const Redis = require('ioredis');
const RedisRequest = require('../index');
const expect = require('chai').expect;

describe('使用extends来扩展redis-request的方法', function(){
    it('扩展的参数是个方法', function(){
        const redisRequest = RedisRequest(new Redis(), new Redis());
        redisRequest.extends(function tt(){});
        expect(
            typeof redisRequest.tt === 'function' &&
            redisRequest.tt.type === '.tt'
        ).to.be.ok;
        redisRequest.disconnect();
    });
    it('扩展的参数是个对象', function(){
        const redisRequest = RedisRequest(new Redis(), new Redis());
        redisRequest.extends({
            aa: function(){},
            bb: function(){}
        });
        expect(
            typeof redisRequest.aa === 'function' &&
            redisRequest.aa.type === '.aa' &&
            typeof redisRequest.bb === 'function' &&
            redisRequest.bb.type === '.bb'
        ).to.be.ok;
        redisRequest.disconnect();
    });
    it('扩展的参数是个深层次的对象', function(){
        const redisRequest = RedisRequest(new Redis(), new Redis());
        redisRequest.extends({
            aa: function(){},
            bb: {
                aaa: function(){},
                ccc: {
                    aaaa: function(){}
                }
            }
        });
        expect(
            typeof redisRequest.aa === 'function' &&
            redisRequest.aa.type === '.aa' &&
            typeof redisRequest.bb.aaa === 'function' &&
            redisRequest.bb.aaa.type === '.bb.aaa' && 
            typeof redisRequest.bb.ccc.aaaa === 'function' &&
            redisRequest.bb.ccc.aaaa.type === '.bb.ccc.aaaa'
        ).to.be.ok;
        redisRequest.disconnect();
    });
});
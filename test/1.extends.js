const Redis = require('ioredis');
const RedisRequest = require('../index');
const expect = require('chai').expect;

describe('Extend deep object', function(){
    it('Extend Only one function', function(){
        const redisRequest = RedisRequest(new Redis(), new Redis());
        redisRequest.extends(function tt(){});
        expect(
            typeof redisRequest.tt === 'function' &&
            redisRequest.tt.type === '.tt'
        ).to.be.ok;
        redisRequest.disconnect();
    });

    it('Extend an object', function(){
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

    it('Extend deep an object', function(){
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
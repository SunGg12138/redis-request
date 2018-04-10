const expect = require('chai').expect;
const spawn = require('child_process').spawn;
describe('为多进程的socket.io扩展事件', function(){
    this.timeout(5000);
    it('扩展clients事件，来获取指定房间的socketId', function(done){
        let exitCount = 0;
        for (let i = 0; i < 4; i++) {
            let child = spawn('node', [
                __dirname + '/socket/clients.js',
                i
            ]);
            child.stdout.on('data', function(data){
                try {
                    expect(JSON.parse(data.toString()).length === 4).to.be.ok;
                    let timer = setInterval(function(){
                        if (exitCount === 4) {
                            clearInterval(timer);
                            done();
                        }
                    });
                } catch (error) {
                    console.log(error);
                }
            });
            child.stderr.on('data', function(data){
                console.log(data.toString());
            });
            child.on('exit', function(){
                exitCount++;
            });
        }
    });
    it('扩展clientsAsync事件，来异步获取指定房间的socketId', function(done){
        let exitCount = 0;
        for (let i = 0; i < 4; i++) {
            let child = spawn('node', [
                __dirname + '/socket/clientsAsync.js',
                i
            ]);
            child.stdout.on('data', function(data){
                try {
                    expect(JSON.parse(data.toString()).length === 4).to.be.ok;
                    let timer = setInterval(function(){
                        if (exitCount === 4) {
                            clearInterval(timer);
                            done();
                        }
                    });
                } catch (error) {
                    console.log(error);
                }
            });
            child.stderr.on('data', function(data){
                console.log(data.toString());
            });
            child.on('exit', function(){
                exitCount++;
            });
        }
    });
    it('扩展broadcast事件，来广播事件', function(done){
        let count = 0;
        let exitCount = 0;
        for (let i = 0; i < 4; i++) {
            let child = spawn('node', [
                __dirname + '/socket/broadcast.js',
                i
            ]);
            child.stdout.on('data', function(data){
                try {
                    if (JSON.parse(data.toString()).message === 'I get it.') {
                        count++;
                        test();
                    }
                } catch (error) {
                    console.log(error);
                }
            });
            child.stderr.on('data', function(data){
                console.log(data.toString());
            });
            child.on('exit', function(){
                exitCount++;
            });
        }

        function test(){
            if (count === 4) {
                let timer = setInterval(function(){
                    if (exitCount === 4) {
                        clearInterval(timer);
                        done();
                    }
                });
            }
        }
    });
    it('扩展emit事件，来指定socketId触发事件', function(done){
        let count = 0;
        let exitCount = 0;
        for (let i = 0; i < 4; i++) {
            let child = spawn('node', [
                __dirname + '/socket/emit.js',
                i
            ]);
            child.stdout.on('data', function(data){
                try {
                    if (JSON.parse(data.toString()).message === 'I get it.') {
                        count++;
                        setTimeout(function(){
                            expect(count === 1).to.be.ok;
                            done();
                        }, 500);
                    }
                } catch (error) {
                    console.log(error);
                }
            });
            child.stderr.on('data', function(data){
                console.log(data.toString());
            });
            child.on('exit', function(){
                exitCount++;
            });
        }
    });
});
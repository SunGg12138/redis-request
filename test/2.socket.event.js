const expect = require('chai').expect;
const spawn = require('child_process').spawn;
describe('socket.io event', function(){
    this.timeout(5000);

    it('socket clients event', function(done){
        let exitCount = 0;
        for (let i = 0; i < 4; i++) {
            let child = spawn('node', [
                __dirname + '/socket/clients.js',
                i
            ]);
            child.stdout.on('data', function(data){
                expect(JSON.parse(data.toString()).length === 4).to.be.ok;
                let timer = setInterval(function(){
                    if (exitCount === 4) {
                        clearInterval(timer);
                        done();
                    }
                });
            });
            child.stderr.on('data', function(data){
                console.log(data.toString());
            });
            child.on('exit', function(){
                exitCount++;
            });
        }
    });

    it('socket broadcast event', function(done){
        let count = 0;
        let exitCount = 0;
        for (let i = 0; i < 4; i++) {
            let child = spawn('node', [
                __dirname + '/socket/broadcast.js',
                i
            ]);
            child.stdout.on('data', function(data){
                if (JSON.parse(data.toString()).message === 'I get it.') {
                    count++;
                    test();
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
});
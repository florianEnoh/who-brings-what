const server = require('../server');

exports.bootApi = function bootApi() {
    beforeEach(function() {
        return server.start();
    });


    afterEach(function() {
        return server.stop();
    });
}
const { getStatus } = require('./statusHandler');

exports.register = function(server, options, next) {
    server.route({
        method: 'GET',
        path: '/status',
        config: {
            handler: getStatus,
            tags: ['api']
        }

    });

    return next();
};

exports.register.attributes = {
    name: 'status-api',
    version: '1.0.0'
};
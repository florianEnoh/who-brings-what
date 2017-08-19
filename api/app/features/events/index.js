const { create } = require('./eventHandler');

exports.register = function(server, options, next) {
    server.route({
        method: 'POST',
        path: '/events',
        config: {
            handler: create,
            tags: ['api']
        }

    });

    return next();
};

exports.register.attributes = {
    name: 'events-api',
    version: '1.0.0'
};
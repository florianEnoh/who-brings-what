const eventHandler = require('./eventHandler');

exports.register = function(server, options, next) {
    server.route({
        method: 'POST',
        path: '/events',
        config: {
            handler: eventHandler.create,
            tags: ['api']
        }

    });

    return next();
};

exports.register.attributes = {
    name: 'events-api',
    version: '1.0.0'
};
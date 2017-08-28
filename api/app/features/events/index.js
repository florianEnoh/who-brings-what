const eventHandler = require('./eventHandler');
const Joi = require('joi');

exports.register = function(server, options, next) {
    server.route({
        method: 'POST',
        path: '/events',
        config: {
            handler: eventHandler.create,
            validate: {
                payload: {
                    host: Joi.object().required(),
                    event: Joi.object().required()
                }
            },
            tags: ['api']
        }

    });

    return next();
};

exports.register.attributes = {
    name: 'events-api',
    version: '1.0.0'
};
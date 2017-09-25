const eventHandler = require('./eventHandler');
const Joi = require('joi');

exports.register = function(server, options, next) {
    server.route([{
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
        },
        {
            method: 'POST',
            path: '/events/{code}/guests',
            config: {
                handler: eventHandler.addGuest,
                validate: {
                    params: {
                        code: Joi.string()
                    },
                    payload: {
                        guest: Joi.object().required(),
                        contribution: Joi.array().required()
                    }
                },
                tags: ['api']
            }
        },
        {
            method: 'GET',
            path: '/events/{code}',
            config: {
                handler: eventHandler.fetch,
                validate: {
                    params: {
                        code: Joi.string()
                    }
                },
                tags: ['api']
            }
        }
    ]);

    return next();
};

exports.register.attributes = {
    name: 'events-api',
    version: '1.0.0'
};
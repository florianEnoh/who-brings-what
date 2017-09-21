const guestService = require('../../domain/services/guest-service');
const eventRepository = require('../../infrastructure/repositories/event-repository');

const contribution = [{
    name: 'soda',
    quantity: 1
}];

exports.register = function(server, options, next) {
    server.route({
        method: 'POST',
        path: '/users-rpc',
        config: {
            handler: function(request, reply) {

                return eventRepository
                    .findByCode('cz157l1j8lj7drae0n')
                    .then((event) => {
                        const eventNeeds = event.needs.map((item) => {
                            const foundedInvolvement = Object.values(contribution).find((involvement) => {
                                return involvement.name === item.name;
                            });
                            item.quantity -= foundedInvolvement && foundedInvolvement.quantity || 0;
                            return item;
                        });
                        event.needs = eventNeeds;
                        return event.save();
                    })
                    .then((event) => {
                        reply(event).code(201);
                    })
                    .catch((err) => {
                        console.log(err);
                        reply(err).code(400);
                    });
            },
            tags: ['api']
        }

    });

    return next();
};

exports.register.attributes = {
    name: 'users-rpc-api',
    version: '1.0.0'
};


// const { event } = request.payload;
//                 return guestService.joinEvent('cz157l1j8lj7dihxd2', { username: 'New rpc guest' })
//                     .then(() => reply().code(201))
//                     .catch((err) => {
//                         console.log(error);
//                         return reply(err).code(500);
//                     });
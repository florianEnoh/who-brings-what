const Boom = require('boom');
const userService = require('../../domain/services/user-service');
const eventService = require('../../domain/services/event-service');

module.exports = {
    create(request, reply) {
        return userService
            .createHost(request.payload.host)
            .then(({ _id: userId }) => {
                return eventService.createEvent(userId, request.payload.event);
            })
            .then(url => reply(url).code(201))
            .catch((err) => {
                const statusCode = _getErrorStatusCode(err);
                reply(err).code(statusCode);
            });
    },

    addGuest(request, reply) {
        reply();
    }
};

function _getErrorStatusCode(err) {
    return ('name' in err) ? 500 : 422;
}
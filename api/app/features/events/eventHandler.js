const Boom = require('boom');
const hostService = require('../../domain/services/host-service');
const eventService = require('../../domain/services/event-service');

module.exports = {
    create(request, reply) {
        return hostService
            .createHost(request.payload.user)
            .then(({ _id: userId }) => {
                return eventService.createEvent(userId, request.payload.event);
            })
            .then(url => reply(url).code(201))
            .catch((err) => {
                const statusCode = _getErrorStatusCode(err);
                reply(err).code(statusCode);
            });
    }
};

function _getErrorStatusCode(err) {
    return ('name' in err) ? 500 : 422;
}
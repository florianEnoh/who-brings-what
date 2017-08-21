const Boom = require('boom');
const hostService = require('../../domain/services/host-service');
const eventService = require('../../domain/services/event-service');

module.exports = {
    create(request, reply) {
        const { user } = request.payload;
        const { event } = request.payload;

        return hostService
            .createHost(user)
            .then((userId) => {
                const eventDetails = Object.assign({}, { userId }, event);
                return eventService.createEvent(eventDetails);
            });
    }
};
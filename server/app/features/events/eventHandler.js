const hostService = require('../../domain/services/host-service');
const guestService = require('../../domain/services/guest-service');
const eventService = require('../../domain/services/event-service');
const contributionService = require('../../domain/services/contribution-service');
const serializer = require('../../infrastructure/serializer');
const { EventNotFoundError } = require('../../domain/errors/errors');

module.exports = {
    create(request, reply) {
        return hostService
            .createHost(request.payload.host)
            .then((host) => eventService.createEvent(host._id, request.payload.event))
            .then(event => reply(event).code(201))
            .catch((err) => {
                const serializedError = serializer.serializeError(err);
                return reply(serializedError.data).code(serializedError.code);
            });
    },

    addGuest(request, reply) {

        const { guest, contribution } = request.payload;
        const eventCode = request.params.code;

        return eventService.isEventCodeExist(eventCode)
            .then(() => guestService.joinEvent(eventCode, guest))
            .then(({ guestId, eventId }) => contributionService.add(guestId, eventId, contribution))
            .then(() => eventService.updateNeeds(eventCode, contribution))
            .then(() => reply(eventService.getEventByCode(eventCode)).code(201))
            .catch((err) => {
                const serializedError = serializer.serializeError(err);
                return reply(serializedError.data).code(serializedError.code);
            });
    },

    fetch(request, reply) {
        const eventCode = request.params.code;
        return eventService
            .isEventCodeExist(eventCode)
            .then(_ => eventService.getEventByCode(eventCode))
            .then(event => {
                return reply(event).code(200);
            })
            .catch((err) => {
                const serializedError = serializer.serializeError(err);
                return reply(serializedError.data).code(serializedError.code);
            });
    }
};
const userRepository = require('../../infrastructure/repositories/user-repository');
const eventRepository = require('../../infrastructure/repositories/event-repository');
const contributionRepository = require('../../infrastructure/repositories/contribution-repository');

module.exports = {
    joinEvent: async function(eventCode, guest) {
        const { _id: guestId } = await this.save(guest);
        const { _id: eventId } = await this.addGuest(eventCode, guestId);
        return Promise.resolve({ guestId, eventId });
    },
    save(guest) {
        return userRepository.save(guest);
    },

    addGuest(eventCode, guestId) {
        return eventRepository.addGuest(eventCode, guestId);
    }
};
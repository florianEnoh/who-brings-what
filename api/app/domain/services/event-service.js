const shortid = require('uniqid');
const eventRepository = require('../../infrastructure/repositories/event-repository');
const { EventNotFoundError } = require('../../domain/errors/errors');

module.exports = {
    createEvent(hostId = '', event = {}) {
        event['hostId'] = hostId;
        event['code'] = shortid();
        return eventRepository.save(event);
    },

    isEventCodeExist(code) {
        return eventRepository.findByCode(code)
            .then((event) => {
                if (!event) {
                    throw EventNotFoundError.toJson();
                }
                return true;
            });
    },

    updateNeeds(eventCode, contribution) {
        return eventRepository
            .findByCode(eventCode)
            .then((event) => this.updateNeedsQuantity(event, contribution))
            .then((updatedEvent) => eventRepository.save(updatedEvent));
    },

    updateNeedsQuantity(event, contribution) {
        event.needs.map((item, index) => {
            const quantityToDecrease = _getQuantityToDecrease(item, contribution);
            event.needs[index].quantity = _decreaseQuantity(item.quantity, quantityToDecrease);
        });
        return event;
    },

    getEventByCode(eventCode) {
        return eventRepository
            .getEventAggregateByCode(eventCode)
            .then((event) => event[0]);
    }
};

function _getQuantityToDecrease(eventNeed, contributionList) {
    const matchedIndex = contributionList.findIndex((involvement) => involvement.name === eventNeed.name);
    return (matchedIndex > -1) ? contributionList[matchedIndex].quantity : 0;
}

function _decreaseQuantity(oldQuantity, newQuantity) {
    return (oldQuantity > newQuantity) ? (oldQuantity - newQuantity) : 0;
}
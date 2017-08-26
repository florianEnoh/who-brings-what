const shortid = require('shortid');
const eventRepository = require('../../infrastructure/repositories/event-repository');
const { EventCreationError } = require('../../domain/errors/errors');

module.exports = {
    createEvent(hostId = '', event = {}) {

        event['hostId'] = hostId;
        event['url'] = shortid.generate();

        return eventRepository.save(event)
            .catch((err) => {
                throw _getErrors(err);
            });
    }
};

function _getErrors(err) {
    return Object.keys(err.errors).reduce((errorList, key) => {
        const { name: type } = err.errors[key];
        errorList.push({ key, type });
        return errorList;
    }, []);
}
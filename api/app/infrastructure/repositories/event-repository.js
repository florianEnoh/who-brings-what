const Event = require('../../domain/models/event');

module.exports = {
    save(event) {
        return new Event(event).save()
            .then(event => event.url);
    }
};
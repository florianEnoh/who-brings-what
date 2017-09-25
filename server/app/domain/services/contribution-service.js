const contributionRepository = require('../../infrastructure/repositories/contribution-repository');

module.exports = {

    add(guestId, eventId, involvements) {
        if (involvements.length < 1) {
            return Promise.resolve();
        }
        return contributionRepository.addNew({ userId: guestId, eventId, involvements });
    }
};
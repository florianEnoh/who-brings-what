const Contribution = require('../../domain/models/contribution');

module.exports = {
    addNew(contribution) {
        return new Contribution(contribution).save();
    }
}
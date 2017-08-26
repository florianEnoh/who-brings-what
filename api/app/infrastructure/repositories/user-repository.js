const User = require('../../domain/models/user');

module.exports = {

    save(user) {
        return new User(user).save();
    }
};
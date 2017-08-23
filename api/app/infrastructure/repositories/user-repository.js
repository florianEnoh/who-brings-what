const User = require('../../domain/models/user');

module.exports = {

    save(user) {
        return new Promise((resolve, reject) => {
            return new User(user).save((err, user) => {
                if (err) {
                    return reject(err);
                }
                return resolve(user._id);
            });
        });

    }
};
require('rootpath')();
const UserRepository = require('app/infrastructure/repositories/user-repository');

module.exports = {
    createHost(user) {

        return UserRepository
            .save(user)
            .catch((err) => {
                return err;
            });
    }
}
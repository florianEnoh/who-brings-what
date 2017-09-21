const UserRepository = require('../../infrastructure/repositories/user-repository');

module.exports = {
    createHost(user = {}) {
        return UserRepository.save(user);
    }
};
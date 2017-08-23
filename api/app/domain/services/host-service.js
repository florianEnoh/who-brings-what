require('rootpath')();
const UserRepository = require('app/infrastructure/repositories/user-repository');

module.exports = {
    createHost(user) {
        return UserRepository
            .save(user)
            .then((createdUserIdObject) => {
                return createdUserIdObject['_id'];
            })
            .catch((err) => {
                throw err;
            });
    }
}
require('rootpath')();
const UserRepository = require('app/infrastructure/repositories/user-repository');

module.exports = {
    createHost(user = {}) {
        return UserRepository
            .save(user)
            .catch((err) => {
                throw _getErrors(err);
            });
    }
};

function _getErrors(err) {
    if (!('errors' in err)) {
        return err;
    }

    return Object.keys(err.errors).reduce((errorList, key) => {
        const { name: type } = err.errors[key];
        errorList.push({ key, type });
        return errorList;
    }, []);
}
const { name, version, description } = require('./../../../package');
module.exports = {
    getStatus(request, reply) {
        reply({ name, version, description });
    }
}
class CreationError extends Error {
    constructor(message) {
        super(message);
    }
}

class HostCreationError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = { CreationError, HostCreationError };
class EventNotFoundError extends Error {
    constructor() {
        super();
    }

    static toJson() {
        return {
            errors: {
                event: {
                    message: 'Fetch fails, event code does’nt exist',
                    name: 'Not Found Error',
                    path: 'code'
                }
            }
        };
    }
}

module.exports = {
    EventNotFoundError
};
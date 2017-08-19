const Mongoose = require('mongoose'),
    config = require('./config');


module.exports = {
    dbInstance: null,

    create() {
        this.connect();
        this.dbInstance = Mongoose.connection;
        this.listen();
    },

    connect() {
        Mongoose.connect('mongodb://' + config.database.host + '/' + config.database.db, { useMongoClient: true });
    },

    listen() {
        this.dbInstance.on('error',
            console.error.bind(console, 'connection error')
        );

        this.dbInstance.on('openUri', () => {
            console.log("Connection with database succeeded.");
        });
    }
};
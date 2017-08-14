const Hapi = require('hapi');
const plugins = require('./app/infrastructure/plugins');
const routes = require('./app/infrastructure/routes');

module.exports = {
    instance: null,
    configuration: [],

    create() {
        this.instance = new Hapi.Server();
        this.configuration = [].concat(routes, plugins);
        this.listen();
        this.addPlugins();
    },

    start() {
        this.create();
        return this.instance.start();
    },

    addPlugins() {
        this.instance
            .register(this.configuration, {
                routes: {
                    prefix: '/api'
                }
            }, (err) => {
                if (err) console.log(err);
            });
    },

    BootStrapTestHelper() {
        this.create();
        return this.instance;
    },

    listen() {
        this.instance.connection({
            host: 'localhost',
            port: 8080,
            routes: { "cors": true }
        });
    }
}
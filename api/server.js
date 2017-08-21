const Hapi = require('hapi');
const plugins = require('./app/infrastructure/plugins');
const routes = require('./app/infrastructure/routes');
const config = require('./app/infrastructure/config');

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

    BootStrapTestHelper(route) {
        const server = new Hapi.Server();
        server.connection({ port: null });
        server.register({ register: require(`./app/features/${route}`) }, { routes: { prefix: '/api' } });
        return server;
    },

    listen() {
        this.instance.connection({
            host: config.server.host,
            port: config.server.port,
            routes: { "cors": true }
        });
    }
}
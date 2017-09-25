const plugins = [
    require('blipp'),
    require('inert'),
    require('vision'),
    require('hapi-swagger'),
    {
        register: require('good'),
        options: {
            reporters: {
                console: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{
                        response: '*',
                        log: '*'
                    }]
                }, {
                    module: 'good-console'
                }, 'stdout']
            }
        }
    }
];
module.exports = plugins;
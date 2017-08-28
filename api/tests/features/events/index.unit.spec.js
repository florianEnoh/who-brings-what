require('rootpath')();
const Hapi = require('hapi');
const { describe, it, expect, sinon, before, after, beforeEach, afterEach } = require('tests/helper');
const route = require('app/features/events');
const eventHandler = require('app/features/events/eventHandler');


describe('Unit | Route | Event Index ', function() {

    let server;

    beforeEach(() => {
        server = require('server').BootStrapTestHelper('events');
    });

    afterEach(() => {
        server.stop();
    });

    describe('Server', () => {

        it('should have an object, version, and name attribute', () => {
            // then
            expect(route.register.attributes).to.exist;
            expect(route.register.attributes).to.be.an('object');
            expect(route.register.attributes.name).to.equal('events-api');
            expect(route.register.attributes).to.have.property('version');
        });

    });

    describe('Route POST /api/events', () => {

        before(() => {
            sinon.stub(eventHandler, 'create').callsFake((request, reply) => reply('ok'));
        });

        after(() => {
            eventHandler.create.restore();
        });

        it('should exist', () => {
            // when
            return server.inject({
                method: 'POST',
                url: '/api/events',
                payload: {
                    host: {},
                    event: {}
                }
            }).then((res) => {
                // then
                expect(res.statusCode).to.equal(200);
            });
        });
    });
});
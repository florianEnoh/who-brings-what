require('rootpath')();
const { describe, it, expect, server, sinon } = require('tests/helper');
const route = require('app/features/events');
const handler = require('app/features/events/eventHandler');

describe('Unit | Route | Event Index ', function() {

    describe('Server', () => {

        it('should have an attributes', () => {
            // then
            expect(route.register.attributes).to.exist;
            expect(route.register.attributes).to.be.an('object');
            expect(route.register.attributes.name).to.equal('events-api');
            expect(route.register.attributes).to.have.property('version');
        });

    });

    describe('Route Get /events', () => {

        it('should exist', () => {
            // when
            server.inject({
                method: 'POST',
                url: '/api/events',
                payload: {}
            }, (res) => {
                // then
                expect(res.statusCode).to.equal(200);
            });
        });

        it('should call route handler', () => {
            const createStub = sinon.stub(handler, 'create').callsFake((request, reply) => { reply('ok') });

            server.inject({
                method: 'POST',
                url: '/api/events',
                payload: {}
            }, (res) => {
                // then
                sinon.assert.calledOnce(handler.create);
                createStub.restore();
            });
        });
    });
});
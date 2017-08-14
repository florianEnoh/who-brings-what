const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const Hapi = require('hapi');
const sinon = require('sinon');
const server = require('../../../server').BootStrapTestHelper();
const route = require('../../../app/features/status').register;

describe('Unit | Handler | Status Index ', function() {

    describe('Server', () => {

        it('should have an attributes', () => {
            // then
            expect(route.attributes).to.exist;
            expect(route.attributes).to.be.an('object');
            expect(route.attributes.name).to.equal('status-api');
            expect(route.attributes).to.have.property('version');
        });

    });

    describe('Route Get /status', () => {

        it('should exist', () => {
            // when
            server.inject({
                method: 'GET',
                url: '/api/status',
                payload: {}
            }, (res) => {
                // then
                expect(res.statusCode).to.equal(200);
            });
        });
    });
});
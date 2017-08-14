const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const Hapi = require('hapi');
const sinon = require('sinon');
const server = require('../../../server').BootStrapTestHelper();
const route = require('../../../app/features/status').register;
const { name, version, description } = require('./../../../package');
const statusHandler = require('../../../app/features/status/statusHandler');

describe('Unit | Handler | Status Handler ', function() {

    describe('#getStatus', () => {

        describe('description', () => {

            it('should provide a getStatus method', () => {
                // then
                expect(statusHandler.getStatus).to.exist;
            });

            it('should be a function', () => {
                // then
                expect(statusHandler.getStatus).to.be.a('function');
            });
        });


        describe('Behavior', () => {

            const replySpy = sinon.spy();

            it('should call reply function', () => {
                // when
                statusHandler.getStatus(null, replySpy);

                // then
                sinon.assert.calledOnce(replySpy);
            });

            it('should get Api Informations (Name, description, version', () => {
                // given
                const expectedApiInfos = { name, description, version };

                // when
                statusHandler.getStatus(null, replySpy);

                // then
                sinon.assert.calledWith(replySpy, expectedApiInfos);
            });
        });
    });
});
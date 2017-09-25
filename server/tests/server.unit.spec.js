const { describe, it, expect, beforeEach, afterEach, sinon } = require('./helper');
const server = require('../server');
const config = require('../app/infrastructure/config');

describe('Unit | Server | Methodes ', function() {

    describe('#Create', () => {
        it('should be an existing method', () => {
            // then
            expect(server.create).to.be.a('function');
        });

        let sandbox;

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(server, 'listen').returns(() => {});
            sandbox.stub(server, 'addPlugins').returns(() => {});
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should instantiate a new service with all goods configs', (done) => {
            // when
            server.create();

            // then
            expect(server.instance).to.not.be.null;
            expect(server.configuration).to.be.an.instanceOf(Array);
            sinon.assert.calledOnce(server.listen);
            sinon.assert.calledOnce(server.addPlugins);
            done();
        });
    });

    describe('#Start', () => {

        it('should be an existing method', () => {
            // then
            expect(server.start).to.be.a('function');
        });


        beforeEach(() => {
            sinon.stub(server, 'create').returns(() => {});
        });

        afterEach(() => {
            server.create.restore();
        });

        it('should start the server', () => {
            // given
            server.instance = {
                start() {}
            };
            // when
            server.start();

            // then
            return sinon.assert.calledOnce(server.create);
        });
    });


    describe('#addPlugins', () => {
        it('should be an existing method', () => {
            // then
            expect(server.addPlugins).to.be.a('function');
        });
    });

    describe('#BootStrapTestHelper', () => {
        it('should be an existing method', () => {
            // then
            expect(server.BootStrapTestHelper).to.be.a('function');
        });
    });

    describe('#Listen', () => {

        it('should be an existing method', () => {
            // then
            expect(server.listen).to.be.a('function');
        });


        it('should handle a hapi server connection', () => {
            // given
            const connectionSpy = sinon.spy();
            const expectedConnectionArgs = { host: config.server.host, port: config.server.port, routes: { cors: true } };
            server.instance = {
                connection: connectionSpy
            };

            // when
            server.listen();

            // then
            sinon.assert.calledOnce(connectionSpy);
            sinon.assert.calledWith(connectionSpy, expectedConnectionArgs)
        });
    });

});
require('rootpath')();
const { describe, it, expect, server, sinon, beforeEach, afterEach } = require('tests/helper');
const hostService = require('app/domain/services/host-service');
const UserRepository = require('app/infrastructure/repositories/user-repository');

describe('Unit | Service | Host ', function() {

    describe('#createHost', () => {

        let sandbox;

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(UserRepository, 'save');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should be a function', () => {
            // then
            expect(hostService.createHost).to.be.a('function');
        });

        it('should call User repository', () => {
            // given
            UserRepository.save.resolves();

            const user = {
                username: 'flo'
            }

            // when
            hostService.createHost(user);

            // then
            sinon.assert.calledOnce(UserRepository.save);
            sinon.assert.calledWith(UserRepository.save, user);
        });

        it('should return a promise', () => {
            // given
            UserRepository.save.rejects(new Error());

            // when
            const promise = hostService.createHost({});

            // then
            return expect(promise).to.be.resolved;
        });

        describe('When something going wrong', () => {

            it('should return a rejected promise', () => {
                // given
                UserRepository.save.rejects(new Error());

                // when
                const promise = hostService.createHost({});

                // then
                return promise.then((err) => {
                    expect(promise).to.be.fulfilled;
                    expect(err).to.be.an.instanceof(Error);
                });
            });

            it('should return log an error');

        });

        describe('When saving succeeds', () => {

            it('should return a resolved promise with a userId');

        });
    });

});
require('rootpath')();
const { describe, it, expect, server, sinon, beforeEach, afterEach } = require('tests/helper');
const hostService = require('app/domain/services/host-service');
const UserRepository = require('app/infrastructure/repositories/user-repository');
const { HostCreationError } = require('app/domain/errors');

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

        it('should return a promise', () => {
            // given
            UserRepository.save.rejects(new Error());

            // when
            const promise = hostService.createHost({});

            // then
            return promise.catch(() => {
                expect(promise).to.be.an.instanceof(Promise);
            });
        });

        it('should call User repository', () => {
            // given
            UserRepository.save.rejects({});

            const user = {
                username: 'flo'
            }

            // when
            const promise = hostService.createHost(user);

            // then
            return promise.catch(() => {
                sinon.assert.calledOnce(UserRepository.save);
                sinon.assert.calledWith(UserRepository.save, user);
            });

        });



        describe('When saving succeeds', () => {

            it('should return a resolved promise with a userId', () => {
                // given
                const createdUserId = {
                    "_id": '5996a7e208c6562b4c6c6579'
                };

                const user = {
                    username: 'flo'
                };

                UserRepository.save.resolves(createdUserId);

                // when
                const promise = hostService.createHost(user);

                // then
                return promise.then((userId) => {
                    expect(userId).to.equal('5996a7e208c6562b4c6c6579');
                });
            });

        });



        describe('When something going wrong', () => {

            it('should return a rejected promise', () => {
                // given
                UserRepository.save.rejects(new HostCreationError());

                // when
                const promise = hostService.createHost({});

                // then
                return promise.catch((err) => {
                    expect(promise).to.be.rejected;
                    expect(err).to.be.an.instanceof(HostCreationError);
                });
            });

        });

    });

});
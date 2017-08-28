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

        it('should call a  User repository', () => {
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

            it('should return a resolved promise with a user', () => {
                // given
                const createdUser = {
                    "_id": '5996a7e208c6562b4c6c6579',
                    username: 'flo'
                };

                const user = {
                    username: 'flo'
                };

                UserRepository.save.resolves(createdUser);

                // when
                const promise = hostService.createHost(user);

                // then
                return promise.then((userId) => {
                    expect(userId).to.equal(createdUser);
                });
            });

        });



        describe('When something going wrong', () => {

            const fakeCastError = {
                errors: {
                    email: {
                        name: 'CastError'
                    }
                },
                _message: 'User cast must be an object',
                name: 'Error'
            };

            const fakeValidationError = {
                errors: {
                    username: {
                        name: 'ValidationError'
                    }
                },
                _message: 'User validation failed',
                name: 'Error'
            };

            const fakeMultipleErrors = {
                errors: {
                    username: {
                        name: 'ValidationError'
                    },
                    email: {
                        name: 'CastError'
                    }
                },
                _message: 'User validation failed',
                name: 'Error'
            };

            describe('Invalid parameters', () => {

                it('should return a rejected promise, when a required data is provided has not a valid format (CastError)', () => {
                    // given
                    UserRepository.save.rejects(fakeCastError);

                    // when
                    const promise = hostService.createHost({ username: 5 });

                    // then
                    return promise.catch((err) => {
                        expect(err).to.eql([{ key: 'email', type: 'CastError' }]);
                    });
                });

                it('should return a rejected promise, when a required data is provided has not a valid format (ValidationError)', () => {
                    // given
                    UserRepository.save.rejects(fakeValidationError);

                    // when
                    const promise = hostService.createHost({});

                    // then
                    return promise.catch((err) => {
                        expect(err).to.eql([{ key: 'username', type: 'ValidationError' }]);
                    });
                });

            });

            it('should return a rejected promise, when a multiple errors', () => {
                // given
                UserRepository.save.rejects(fakeMultipleErrors);

                // when
                const promise = hostService.createHost({ email: '' });

                // then
                return promise.catch((err) => {
                    expect(err).to.eql([{ key: 'username', type: 'ValidationError' }, { key: 'email', type: 'CastError' }]);
                });
            });

            it('should reject a promise also when error is unknown', () => {
                // given
                const error = new Error();
                UserRepository.save.rejects(error);

                // when
                const promise = hostService.createHost({ email: '' });

                // then
                return promise.catch((err) => {
                    expect(err).to.eql(error);
                });
            });

        });

    });

});
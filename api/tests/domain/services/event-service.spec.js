require('rootpath')();
const { describe, it, expect, server, sinon, beforeEach, afterEach } = require('tests/helper');
const eventService = require('app/domain/services/event-service');
const eventRepository = require('app/infrastructure/repositories/event-repository');
const { EventCreationError } = require('app/domain/errors/errors');

describe.only('Unit | Service | Event ', function() {

    describe('#createEvent', () => {

        let sandbox;

        it('should be a function', () => {
            // then
            expect(eventService.createEvent).to.be.a('function');
        });


        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(eventRepository, 'save');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should call Event Repository', () => {
            // given
            eventRepository.save.resolves('');

            // when
            eventService.createEvent();

            // then
            sinon.assert.calledOnce(eventRepository.save);
        });

        describe('When saving succeeds', () => {

            it('should return an event url', () => {
                // given
                const hostId = 10;
                const event = {
                    title: 'My random event'
                };

                const expectedUrl = { url: '/api/events/SyFihZn_b' };
                eventRepository.save.resolves('SyFihZn_b');

                // when
                const promise = eventService.createEvent(hostId, event);

                // then
                return promise.then((result) => {
                    expect(result).to.not.be.null;
                    expect(result).to.eql(expectedUrl);

                    const args = eventRepository.save.getCall(0).args[0];
                    expect(args).to.include.keys('title', 'hostId', 'url');
                    expect(args.title).to.eql(event.title);
                    expect(args.hostId).to.eql(hostId);
                });
            });

        });

        describe('When something going wrong', () => {


            const fakeCastError = {
                errors: {
                    hostId: {
                        name: 'CastError'
                    }
                },
                _message: 'User cast must be an object',
                name: 'Error'
            };

            const fakeValidationError = {
                errors: {
                    title: {
                        name: 'ValidationError'
                    }
                },
                _message: 'User validation failed',
                name: 'Error'
            };

            const fakeMultipleErrors = {
                errors: {
                    title: {
                        name: 'ValidationError'
                    },
                    needs: {
                        name: 'CastError'
                    }
                },
                _message: 'User validation failed',
                name: 'Error'
            };

            it('should return a rejected promise, when a required data is provided has not a valid format (CastError)', () => {
                // given
                eventRepository.save.rejects(fakeCastError);

                // when
                const promise = eventService.createEvent(12, { title: 'fake event' });

                // then
                return promise.catch((err) => {
                    expect(err).to.eql([{ key: 'hostId', type: 'CastError' }]);
                });
            });

            it('should return a rejected promise, when a required data is provided has not a valid format (ValidationError)', () => {
                // given
                eventRepository.save.rejects(fakeValidationError);

                // when
                const promise = eventService.createEvent('599dad5cfcdab1aeb3915c6c', {});

                // then
                return promise.catch((err) => {
                    expect(err).to.eql([{ key: 'title', type: 'ValidationError' }]);
                });
            });

            it('should return a rejected promise, when a multiple errors', () => {
                // given
                eventRepository.save.rejects(fakeMultipleErrors);

                // when
                const promise = eventService.createEvent('599dad5cfcdab1aeb3915c6c', { needs: '' });

                // then
                return promise.catch((err) => {
                    expect(err).to.eql([{ key: 'title', type: 'ValidationError' }, { key: 'needs', type: 'CastError' }]);
                });
            });

            it('should reject a promise also when error is unknown', () => {
                // given
                const error = new Error();
                eventRepository.save.rejects(error);

                // when
                const promise = eventService.createEvent('599dad5cfcdab1aeb3915c6c', { needs: '' });

                // then
                return promise.catch((err) => {
                    expect(err).to.eql(error);
                });
            });
        });
    });
});
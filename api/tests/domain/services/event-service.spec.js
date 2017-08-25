require('rootpath')();
const { describe, it, expect, server, sinon, beforeEach, afterEach } = require('tests/helper');
const eventService = require('app/domain/services/event-service');
const eventRepository = require('app/infrastructure/repositories/event-repository');
const { EventCreationError } = require('app/domain/errors/errors');

describe('Unit | Service | Event ', function() {

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
            eventService.createEvent({});

            // then
            sinon.assert.calledOnce(eventRepository.save);
        });

        describe('When saving succeeds', () => {

            it('should return an event link', () => {
                // given
                const hostId = 10;
                const event = {
                    title: 'My random event'
                };

                eventRepository.save.resolves('SyFihZn_b');

                // when
                const promise = eventService.createEvent(hostId, event);

                // then
                return promise.then((result) => {
                    expect(result).to.not.be.null;
                    const args = eventRepository.save.getCall(0).args[0];
                    expect(args).to.include.keys('title', 'hostId', 'url');
                    expect(args.title).to.eql(event.title);
                    expect(args.hostId).to.eql(hostId);
                });
            });

        });

        describe('When something going wrong', () => {
            it('should throw an error', () => {
                // given
                const error = new EventCreationError();
                eventRepository.save.rejects(error);

                // when
                const promise = eventService.createEvent(null, null);

                // then
                return promise.catch((err) => {
                    expect(promise).to.be.rejected;
                    expect(err).to.be.an.instanceof(EventCreationError);
                });
            });

            it('should return a new errror, when event path validation fails', () => {
                // given
                const error = new Error();
                error.name = 'ValidationError';
                const event = {
                    title: 'My random event'
                };

                eventRepository.save.rejects(error);

                // when
                const promise = eventService.createEvent(null, event);

                // then
                return promise.catch((err) => {
                    expect(err).to.be.an.instanceof(EventCreationError);
                });
            });
        });
    });
});
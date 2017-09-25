require('rootpath')();
const { describe, it, expect, server, sinon, beforeEach, afterEach } = require('tests/helper');
const UserRepository = require('app/infrastructure/repositories/user-repository');
const eventRepository = require('app/infrastructure/repositories/event-repository');
const contributionRepository = require('app/infrastructure/repositories/contribution-repository');
const guestService = require('app/domain/services/guest-service');

describe('Unit | Service | Guest ', function() {

    describe('#create', () => {

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
            expect(guestService.save).to.be.a('function');
        });

        it('should save a new guest by calling a userRepository', () => {
            // given
            UserRepository.save.resolves();
            const guest = {
                username: 'Flo-guest'
            };

            // when
            const promise = guestService.save(guest);

            // then
            return promise.then(() => {
                sinon.assert.calledOnce(UserRepository.save);
                sinon.assert.calledWith(UserRepository.save, guest);
            });
        });
    });

    describe('#joinEvent', () => {

        let sandbox;

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(guestService, 'save');
            sandbox.stub(eventRepository, 'addGuest');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should be a function', () => {
            // then
            return expect(guestService.joinEvent).to.be.a('AsyncFunction');
        });

        it('should create a guest', () => {
            // given
            guestService.save.resolves({ _id: 5 });
            const guest = {
                username: 'Flo-guest'
            };

            // when
            const promise = guestService.joinEvent(7, guest);

            // then
            return promise.catch(() => {
                sinon.assert.calledWith(guestService.save, guest);
            });
        });

        it('should add guest to event', () => {
            // given
            guestService.save.resolves({ _id: 5 });
            const createdEvent = {
                _id: 'DDFE123R5'
            };
            eventRepository.addGuest.resolves(createdEvent);
            const guest = {
                username: 'Flo-guest'
            };

            // when
            const promise = guestService.joinEvent(7, guest);

            // then
            return promise.then(() => {
                sinon.assert.calledWith(eventRepository.addGuest, 7, 5);
            });
        });

        it('should return a guest Id and event Id', () => {
            // given
            const expectedGuestId = { _id: 5 };
            guestService.save.resolves(expectedGuestId);
            const createdEvent = {
                _id: 'DDFE123R5'
            };
            eventRepository.addGuest.resolves(createdEvent);
            const guest = {
                username: 'Flo-guest'
            };

            // when
            const promise = guestService.joinEvent(7, guest);

            // then
            return promise.then((guestId) => {
                expect(guestId).to.eql({ guestId: expectedGuestId._id, eventId: createdEvent._id });
            });
        });
    });
});
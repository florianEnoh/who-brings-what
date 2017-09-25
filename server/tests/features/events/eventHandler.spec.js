require('rootpath')();
const { describe, it, expect, server, sinon, beforeEach, afterEach } = require('tests/helper');
const eventHandler = require('app/features/events/eventHandler');
const hostService = require('app/domain/services/host-service');
const eventService = require('app/domain/services/event-service');
const guestService = require('app/domain/services/guest-service');
const contributionService = require('app/domain/services/contribution-service');
const serializer = require('app/infrastructure/serializer');
const { EventNotFoundError } = require('app/domain/errors/errors');

describe('Unit | Handler | Event Handler ', function() {

    describe('#create', () => {

        it('should be a function', () => {
            // then
            expect(eventHandler.create).to.be.a('function');
        });

        describe('Behavior', () => {
            let sandbox;
            let replyStub;
            const request = {
                payload: {
                    username: 'Flo',
                    email: 'contact@flo.me',
                    title: 'My Event'
                }
            };

            beforeEach(() => {
                sandbox = sinon.sandbox.create();
                sandbox.stub(hostService, 'createHost');
                sandbox.stub(eventService, 'createEvent');
                replyStub = sandbox.stub();
            });

            afterEach(() => {
                sandbox.restore();
            });

            describe('Services collaboration', () => {

                it('should call a hostService', () => {
                    // given
                    replyStub.returns({ code: () => {} });
                    hostService.createHost.resolves({ _id: '' })
                    const user = { host: { email: 'contact@flo.me', username: 'Flo' } };
                    const request = {
                        payload: user
                    };

                    // when
                    const promise = eventHandler.create(request, replyStub);

                    // then
                    return promise.then(() => {
                        sinon.assert.calledOnce(hostService.createHost);
                        sinon.assert.calledWith(hostService.createHost, { email: 'contact@flo.me', username: 'Flo' });
                    });
                });

                it('should call a eventService', () => {
                    // given
                    replyStub.returns({ code: () => {} });
                    hostService.createHost.resolves({ _id: '5996a4851c8ce12abd2a4f5b' });

                    const request = {
                        payload: {
                            user: { email: 'contact@flo.me', username: 'Flo' },
                            event: {
                                title: 'Mon invroyable event !'
                            }
                        }
                    };

                    // when
                    const promise = eventHandler.create(request, replyStub);

                    // then
                    return promise.then(() => {
                        sinon.assert.calledOnce(eventService.createEvent);
                        sinon.assert.calledWith(eventService.createEvent,
                            '5996a4851c8ce12abd2a4f5b', {
                                title: 'Mon invroyable event !'
                            }
                        );
                    });
                });

            });

            describe('when an unknown error has occured ', () => {

                it('should response with 500 and serialized error', (done) => {
                    // given
                    const error = new Error('unknown');
                    const codeSpy = sinon.spy();
                    replyStub.returns({ code: codeSpy });
                    hostService.createHost.resolves({ _id: '5996a4851c8ce12abd2a4f5b' });
                    eventService.createEvent.rejects(error);

                    // when
                    const promise = eventHandler.create(request, replyStub);

                    // then
                    promise.then(() => {
                        sinon.assert.calledWith(codeSpy, 500);
                        done();
                    });

                });
            });


        });
    });

    describe('#addGuest', () => {

        it('should be a function', () => {
            // then
            expect(eventHandler.addGuest).to.exist;
            expect(eventHandler.addGuest).to.be.a('function');
        });

        describe('New Guest', () => {
            let sandbox;
            let replyStub;
            const guestPayload = {
                username: 'Flo Guest'
            };
            const request = {
                params: {
                    code: 7
                },
                payload: {
                    guest: guestPayload,
                    contribution: {}
                }
            };

            beforeEach(() => {
                sandbox = sinon.sandbox.create();
                sandbox.stub(guestService, 'joinEvent');
                sandbox.stub(eventService, 'isEventCodeExist');
                sandbox.stub(eventService, 'updateNeeds');
                sandbox.stub(eventService, 'getEventByCode');
                sandbox.spy(serializer, 'serializeError');
                sandbox.stub(contributionService, 'add');
                replyStub = sandbox.stub().returns({ code: () => {} });
            });

            afterEach(() => {
                sandbox.restore();
            });

            it('should verify existence of Event code', () => {
                // given
                eventService.isEventCodeExist.resolves();

                // when
                const promise = eventHandler.addGuest(request, replyStub);

                // then
                return promise.then(() => {
                    sinon.assert.calledWith(eventService.isEventCodeExist, request.params.code);
                });
            });

            it('should join the indicated event', () => {
                // given
                eventService.isEventCodeExist.resolves();
                guestService.joinEvent.resolves({ _id: '' });

                // when
                const promise = eventHandler.addGuest(request, replyStub);

                // then
                return promise.then(() => {
                    sinon.assert.calledOnce(guestService.joinEvent);
                    sinon.assert.calledWith(guestService.joinEvent, request.params.code, request.payload.guest);
                });
            });

            it('should add a contribution', () => {
                // given
                eventService.isEventCodeExist.resolves();
                guestService.joinEvent.resolves({ guestId: 12, eventId: '2344FFGGG' });
                contributionService.add.resolves({});

                // when
                const promise = eventHandler.addGuest(request, replyStub);

                // then
                return promise.then(() => {
                    sinon.assert.calledOnce(contributionService.add);
                    sinon.assert.calledWith(contributionService.add, 12, '2344FFGGG', request.payload.contribution);
                });
            });

            it('should update Event needs', () => {
                // given
                eventService.isEventCodeExist.resolves();
                guestService.joinEvent.resolves(12);
                contributionService.add.resolves({});
                eventService.updateNeeds.resolves();

                // when
                const promise = eventHandler.addGuest(request, replyStub);

                // then
                return promise.then(() => {
                    sinon.assert.calledOnce(eventService.updateNeeds);
                    sinon.assert.calledWith(eventService.updateNeeds, request.params.code, request.payload.contribution);
                });
            });

            it('should reply with aggregated Event', () => {
                // given
                const aggregatedEvent = {};
                eventService.isEventCodeExist.resolves();
                guestService.joinEvent.resolves(12);
                contributionService.add.resolves({});
                eventService.updateNeeds.resolves();
                eventService.getEventByCode.resolves(aggregatedEvent);

                // when
                const promise = eventHandler.addGuest(request, replyStub);

                // then
                return promise.then(() => {
                    sinon.assert.calledOnce(eventService.getEventByCode);
                    sinon.assert.calledWith(eventService.getEventByCode, request.params.code);
                });
            });


            it('should serialize an error, when error occured', (done) => {
                // given
                const error = EventNotFoundError.toJson();
                eventService.isEventCodeExist.rejects(error);

                // when
                const promise = eventHandler.addGuest(request, replyStub);

                // then
                promise.then(() => {
                    sinon.assert.calledOnce(serializer.serializeError);
                    done();
                });
            });
        });
    });

    describe('#fetch', () => {

        let sandbox;
        let replyStub;
        const request = {
            params: {
                code: 7
            }
        };

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(eventService, 'isEventCodeExist');
            sandbox.stub(eventService, 'getEventByCode');
            sandbox.spy(serializer, 'serializeError');
            replyStub = sandbox.stub().returns({ code: () => {} });
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should be a function', () => {
            // then
            expect(eventHandler.fetch).to.be.a('function');
        });

        it('should verify existence of event', () => {
            // given
            eventService.isEventCodeExist.resolves();

            // when
            const promise = eventHandler.fetch(request, replyStub);

            // then
            return promise.then(() => {
                sinon.assert.calledOnce(eventService.isEventCodeExist);
                sinon.assert.calledWith(eventService.isEventCodeExist, request.params.code);
            });
        });

        it('should be a call Event service with eventCode', () => {
            // given
            eventService.isEventCodeExist.resolves();
            eventService.getEventByCode.resolves();

            // when
            const promise = eventHandler.fetch(request, replyStub);

            // then
            return promise.then(() => {
                sinon.assert.calledOnce(eventService.getEventByCode);
                sinon.assert.calledWith(eventService.getEventByCode, request.params.code);
            });
        });


        it('should serialize an error, when error occured', (done) => {
            // given
            const error = EventNotFoundError.toJson();
            eventService.isEventCodeExist.rejects(error);

            // when
            const promise = eventHandler.fetch(request, replyStub);

            // then
            promise.then(() => {
                sinon.assert.calledOnce(serializer.serializeError);
                done();
            });
        });
    });
});
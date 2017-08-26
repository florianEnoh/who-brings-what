require('rootpath')();
const { describe, it, expect, server, sinon, beforeEach, afterEach } = require('tests/helper');
const eventHandler = require('app/features/events/eventHandler');
const hostService = require('app/domain/services/host-service');
const eventService = require('app/domain/services/event-service');

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
                    hostService.createHost.resolves()
                    const user = { user: { email: 'contact@flo.me', username: 'Flo' } };
                    const request = {
                        payload: user
                    };

                    // when
                    eventHandler.create(request, replyStub);

                    // then
                    sinon.assert.calledOnce(hostService.createHost);
                    sinon.assert.calledWith(hostService.createHost, { email: 'contact@flo.me', username: 'Flo' });
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

        });
    });
});
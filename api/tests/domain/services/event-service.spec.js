require('rootpath')();
const { describe, it, expect, server, sinon, beforeEach, afterEach } = require('tests/helper');
const eventService = require('app/domain/services/event-service');
const eventRepository = require('app/infrastructure/repositories/event-repository');
const { EventNotFoundError } = require('app/domain/errors/errors');

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

        it('should call with default values, when none is provided', () => {
            // given
            const expectedEventCalled = {
                hostId: '',
            };
            eventRepository.save.resolves('');

            // when
            const promise = eventService.createEvent();

            // then
            return promise.then(() => {
                const args = eventRepository.save.getCall(0).args[0];
                expect(args).to.include.keys('code', 'hostId');
                expect(args.hostId).to.be.empty;
            });
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

            it('should return the created event', () => {
                // given
                const hostId = 10;
                const event = {
                    title: 'My random event'
                };

                const createdEvent = {
                    _id: '59a9a87d003a7c95ded52496',
                    hostId,
                    title: event.title,
                    code: 'SyFihZn_b',
                    guestsIds: [],
                    needs: []
                };
                eventRepository.save.resolves(createdEvent);

                // when
                const promise = eventService.createEvent(hostId, event);

                // then
                return promise.then((result) => {
                    expect(result).to.eql(createdEvent);
                });
            });

        });

    });

    describe('#isEventCodeExist', function() {

        let sandbox;

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(eventRepository, 'findByCode');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should be a function', () => {
            // then
            expect(eventService.isEventCodeExist).to.be.a('function');
        });

        it('should call Event repository', () => {
            // given
            eventRepository.findByCode.resolves({});
            const eventCode = 'valid_event_code';

            // when
            const promise = eventService.isEventCodeExist(eventCode);

            // then
            return promise.then(() => {
                sinon.assert.calledWith(eventRepository.findByCode, eventCode);
            });
        });

        it('should return true, when code is found', () => {
            // given
            eventRepository.findByCode.resolves({});
            const eventCode = 'valid_event_code';

            // when
            const promise = eventService.isEventCodeExist(eventCode);

            // then
            return promise.then((res) => {
                expect(res).to.be.ok;
            });
        });

        it('should throw an error, when code is not found', (done) => {
            // given
            eventRepository.findByCode.resolves(null);
            const expectedThrownError = EventNotFoundError.toJson();
            const eventCode = 'valid_event_code';

            // when
            const promise = eventService.isEventCodeExist(eventCode);

            // then
            promise.catch((err) => {
                expect(err).to.eql(expectedThrownError);
                done();
            });
        });
    });

    describe('#updateNeeds', () => {

        let sandbox;

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(eventRepository, 'findByCode');
            sandbox.stub(eventService, 'updateNeedsQuantity');
            sandbox.stub(eventRepository, 'save');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should be a function', () => {
            // then
            expect(eventService.updateNeeds).to.be.a('function');
        });

        it('should call Event Repository', (done) => {
            // given
            eventRepository.findByCode.resolves({});
            const eventCode = 'valid_event_code';
            const contribution = [];
            // when
            const promise = eventService.updateNeeds(eventCode, contribution);

            // then
            promise.then(() => {
                sinon.assert.calledWith(eventRepository.findByCode, eventCode);
            });
            done();
        });

        it('should call updateNeedsQuantity', (done) => {
            // given
            const event = {};
            eventRepository.findByCode.resolves(event);
            const eventCode = 'valid_event_code';
            const contribution = [];
            // when
            const promise = eventService.updateNeeds(eventCode, contribution);

            // then
            promise.then(() => {
                sinon.assert.calledWith(eventService.updateNeedsQuantity, event, contribution);
            });
            done();
        });

        it('should call EventRepository#save', (done) => {
            // given
            const event = {};
            eventRepository.findByCode.resolves(event);
            eventService.updateNeedsQuantity.returns({});
            const eventCode = 'valid_event_code';
            const contribution = [];
            // when
            const promise = eventService.updateNeeds(eventCode, contribution);

            // then
            promise.then(() => {
                sinon.assert.calledWith(eventRepository.save, {});
            });
            done();
        });
    });


    describe('#updateNeedsQuantity', () => {

        const singleNeed = {
            "name": "chips",
            "quantity": 10
        };
        const singleContribution = {
            "name": "chips",
            "quantity": 3
        };

        const contributionWithManyQuantity = {
            "name": "chips",
            "quantity": 13
        };

        const multipleContribution = [{
                "name": "chips",
                "quantity": 2
            },
            {
                "name": "soda",
                "quantity": 3
            }
        ];

        const multipleNeeds = [{
                "name": "chips",
                "quantity": 10
            },
            {
                "name": "soda",
                "quantity": 6
            }
        ];
        const event = {
            "_id": "59b44d48b1876b17a6909e42",
            "title": "New potluck",
            "hostId": "59b44d48b1876b17a6909e41",
            "code": "cz157l1j8lj7drae0n",
            "__v": 1,
            "createdAt": "2017-09-09T20:21:28.823Z",
            "needs": [],
            "guestsIds": []
        };

        it('should be a function', () => {
            // then
            expect(eventService.updateNeedsQuantity).to.be.a('function');
        });

        describe('when needs is empty, event needs:', () => {

            it('should not be modified', () => {
                // when
                const updatedEventNeeds = eventService.updateNeedsQuantity(event, [singleContribution]);

                // then
                return expect(updatedEventNeeds.needs).to.equal(event.needs);
            });
        });

        describe('when contribution is empty, event needs:', () => {

            it('should not be modified', () => {
                //given
                const fakeContribution = [];

                // when
                const updatedEventNeeds = eventService.updateNeedsQuantity(event, fakeContribution);

                // then
                return expect(updatedEventNeeds.needs).to.equal(event.needs);
            });
        });

        describe('@Event needs is not empty', () => {

            describe('when contribution item doesn’t exist in event.needs[]', () => {

                it('should not modified event needs', (done) => {
                    // given
                    event.needs.push(singleNeed);
                    const fakeContribution = [{ name: 'soft', quantity: 3 }];

                    // when
                    const updatedEventNeeds = eventService.updateNeedsQuantity(event, fakeContribution);

                    // then
                    expect(updatedEventNeeds.needs).to.equal(event.needs);
                    event.needs = [];
                    done();
                });
            });

            describe('when contribution item exist in event.needs[], needs:', () => {

                it('should be decrease (item quantity)', (done) => {
                    // given
                    event.needs.push(singleNeed);
                    const fakeContribution = [singleContribution];
                    const expectedNeeds = [{
                        "name": "chips",
                        "quantity": 7
                    }];

                    // when
                    const updatedEventNeeds = eventService.updateNeedsQuantity(event, fakeContribution);

                    // then
                    expect(updatedEventNeeds.needs).to.eql(expectedNeeds);
                    event.needs = [];
                    done();
                });


                it('should be set to 0, when contribution item quantity is greater', (done) => {
                    // given
                    event.needs.push(singleNeed);
                    const fakeContribution = [contributionWithManyQuantity];
                    const expectedNeeds = [{
                        "name": "chips",
                        "quantity": 0
                    }];

                    // when
                    const updatedEventNeeds = eventService.updateNeedsQuantity(event, fakeContribution);

                    // then
                    expect(updatedEventNeeds.needs).to.eql(expectedNeeds);
                    event.needs = [];
                    done();
                });

                it('should be decrease (items quantity)', (done) => {
                    // given
                    event.needs = multipleNeeds;
                    const fakeContribution = multipleContribution;
                    const expectedNeeds = [{
                            "name": "chips",
                            "quantity": 8
                        },
                        {
                            "name": "soda",
                            "quantity": 3
                        }
                    ];

                    // when
                    const updatedEventNeeds = eventService.updateNeedsQuantity(event, fakeContribution);

                    // then
                    expect(updatedEventNeeds.needs).to.eql(expectedNeeds);
                    event.needs = [];
                    done();
                });
            });

        });
    });


    describe('#getEventByCode', () => {

        beforeEach(() => {
            sinon.stub(eventRepository, 'getEventAggregateByCode');
        });

        afterEach(() => {
            eventRepository.getEventAggregateByCode.restore();
        });

        it('should be a function', () => {
            // then
            expect(eventService.getEventByCode).to.be.a('function');
        });

        it('should query Event repository', () => {
            // given
            const aggregatedEvent = [{ title: 'event title' }];
            eventRepository.getEventAggregateByCode.resolves(aggregatedEvent);
            const eventCode = 'code';

            // when
            const promise = eventService.getEventByCode(eventCode);

            // then
            return promise.then((res) => {
                console.log(aggregatedEvent);
                sinon.assert.calledOnce(eventRepository.getEventAggregateByCode);
                sinon.assert.calledWith(eventRepository.getEventAggregateByCode, eventCode);

                expect(res).to.be.equal(aggregatedEvent[0]);
            });
        });
    });
});
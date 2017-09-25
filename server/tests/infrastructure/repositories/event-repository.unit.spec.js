require('rootpath')();
const { describe, it, expect, sinon, beforeEach, afterEach } = require('tests/helper');
const EventRepository = require('app/infrastructure/repositories/event-repository');
const Event = require('app/domain/models/event');

describe('Unit | Repository | Event ', function() {

    describe('#save', () => {
        const event = { title: 'flo' };

        it('should be a function', () => {
            // then
            expect(EventRepository.save).to.be.a('function');
        });

        describe('saving behavior', () => {

            beforeEach(() => {
                sinon.stub(Event.prototype, 'save');
            });

            afterEach(() => {
                Event.prototype.save.restore();
            });

            it('should call Event model', () => {
                // given
                Event.prototype.save.resolves({ title: 'Fake event', url: 'FGOP1!' });

                // when
                const promise = EventRepository.save(event);

                // then
                return promise.then((result) => {
                    sinon.assert.calledOnce(Event.prototype.save);
                });

            });

        });

    });


    describe('adding New Guest', () => {

        beforeEach(() => {
            sinon.stub(Event, 'findOneAndUpdate');
        });

        afterEach(() => {
            Event.findOneAndUpdate.restore();
        });

        it('should be a function', () => {
            // then
            expect(EventRepository.addGuest).to.be.a('function');
        });

        it('should call eventRepository', (done) => {
            // given
            const eventcode = 10;
            const guestId = 15;
            Event.findOneAndUpdate.resolves(guestId);
            // when
            const promise = EventRepository.addGuest(eventcode, guestId);

            // then
            promise.then((result) => {
                sinon.assert.calledOnce(Event.findOneAndUpdate);
                sinon.assert.calledWith(Event.findOneAndUpdate, { code: eventcode }, { $push: { guestsIds: guestId } });
                expect(result).to.equal(guestId);
                done();
            });
        });
    });

    describe('#findByCode', () => {

        beforeEach(() => {
            sinon.stub(Event, 'findOne');
        });

        afterEach(() => {
            Event.findOne.restore();
        });

        it('should be a function', () => {
            // then
            expect(EventRepository.findByCode).to.be.a('function');
        });

        it('should query Event model', () => {
            // then
            const eventCode = 'valid_code';
            Event.findOne.resolves({});

            // when
            const promise = EventRepository.findByCode(eventCode);

            // then
            return promise.then(() => {
                sinon.assert.calledOnce(Event.findOne);
                sinon.assert.calledWith(Event.findOne, { code: eventCode });
            });
        });

    });

    describe('#getEventAggregateByCode', () => {

        beforeEach(() => {
            sinon.stub(Event, 'aggregate');
        });

        afterEach(() => {
            Event.aggregate.restore();
        });

        it('should be a function', () => {
            // then
            expect(EventRepository.getEventAggregateByCode).to.be.a('function');
        });

        it('should correctly query Event model', () => {
            // given
            const eventCode = 'event_code';
            const expArgs = [{
                    $match: {
                        "code": eventCode
                    }
                },

                {
                    $lookup: {
                        "from": "users",
                        "localField": "hostId",
                        "foreignField": "_id",
                        "as": "host"
                    }
                },

                {
                    $unwind: {
                        path: "$host"
                    }
                },

                {
                    $unwind: {
                        path: "$guestsIds",
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $lookup: {
                        "from": "users",
                        "localField": "guestsIds",
                        "foreignField": "_id",
                        "as": "guests"
                    }
                },

                {
                    $unwind: {
                        path: "$guests",
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $lookup: {
                        "from": "contributions",
                        "localField": "guests._id",
                        "foreignField": "userId",
                        "as": "guests.participations"
                    }
                },

                {
                    $unwind: {
                        path: "$guests.participations",
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $group: {
                        _id: "$_id",
                        title: { "$first": "$title" },
                        date: { "$first": "$date" },
                        location: { "$first": "$location" },
                        host: { "$first": "$host.username" },
                        code: { "$first": "$code" },
                        needs: { "$first": "$needs" },
                        guests: { "$push": { username: "$guests.username", participations: "$guests.participations.involvements" } },
                        comments: { "$first": "$comments" }
                    }
                },

                // Stage 10
                {
                    $project: {
                        _id: "$_id",
                        title: 1,
                        date: 1,
                        location: 1,
                        host: 1,
                        code: 1,
                        needs: 1,
                        guests: { $cond: { if: { $eq: ["$guests", [{}]] }, then: [], else: "$guests" } },
                        comments: 1
                    }
                }

            ];
            const expectedArgs = [{
                    $match: {
                        "code": eventCode
                    }
                },

                {
                    $lookup: {
                        "from": "users",
                        "localField": "hostId",
                        "foreignField": "_id",
                        "as": "host"
                    }
                },

                {
                    $unwind: {
                        path: "$guestsIds"
                    }
                },

                {
                    $lookup: {
                        "from": "users",
                        "localField": "guestsIds",
                        "foreignField": "_id",
                        "as": "guests"
                    }
                },

                {
                    $unwind: {
                        path: "$guests"
                    }
                },

                {
                    $lookup: {
                        "from": "contributions",
                        "localField": "guests._id",
                        "foreignField": "userId",
                        "as": "guests.participations"
                    }
                },

                {
                    $unwind: {
                        path: "$host"
                    }
                },

                {
                    $group: {
                        _id: "$_id",
                        title: { "$first": "$title" },
                        date: { "$first": "$date" },
                        location: { "$first": "$location" },
                        host: { "$first": "$host.username" },
                        code: { "$first": "$code" },
                        needs: { "$first": "$needs" },
                        guests: { "$push": { username: "$guests.username", participations: "$guests.participations.involvements" } },
                        comments: { "$first": "$comments" }
                    }
                }
            ];




            Event.aggregate.resolves();

            // when
            const promise = EventRepository.getEventAggregateByCode(eventCode);

            // then
            return promise.then(() => {
                sinon.assert.calledOnce(Event.aggregate);
                sinon.assert.calledWith(Event.aggregate, expArgs);
            });
        });
    });
});
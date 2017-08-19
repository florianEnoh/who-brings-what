require('rootpath')();
const { describe, it, expect } = require('tests/helper');
const Contribution = require('app/domain/models/contribution');

describe('Unit | Model | Contribution Schema ', function() {

    describe('Contribution schema', () => {

        it('should exist', () => {
            // when
            const contribution = new Contribution({});

            // then
            expect(contribution).to.be.an.instanceof(Contribution);
        });

        describe('Error handling on bad properties given', () => {

            [
                { eventId: '' },
                { eventId: '12334445' }
            ]
            .forEach(({ eventId }) => {
                it(`should get an error, when eventId provided is not a valid ObjectId (${eventId} given)`, () => {
                    // given
                    const contribution = new Contribution({
                        eventId: eventId
                    });

                    // when
                    const validation = contribution.validateSync();

                    // then
                    expect(validation.errors).to.include.keys('eventId');
                });
            });


            [
                { userId: '' },
                { userId: '12334445' }
            ]
            .forEach(({ userId }) => {
                it(`should get an error, when userId provided is not a valid ObjectId (${userId} given)`, () => {
                    // given
                    const contribution = new Contribution({
                        userId: userId
                    });

                    // when
                    const validation = contribution.validateSync();

                    // then
                    expect(validation.errors).to.include.keys('userId');
                });
            });

            [
                { eventId: '', userId: '' },
                { eventId: '12334445', userId: '124R4E' },
                { eventId: '12334445', userId: '5996a4851c8ce12abd2a4f5b' }
            ]
            .forEach(({ eventId, userId }) => {
                it(`should get an error, when at least eventId or userId provided is not a valid ObjectId (eventId : ${eventId} and userId : ${userId}  given)`, () => {
                    // given
                    const contribution = new Contribution({
                        eventId,
                        userId
                    });

                    // when
                    const validation = contribution.validateSync();

                    // then
                    expect(validation.errors).to.include.any.keys('eventId', 'userId');
                });
            });


        });

        describe('Success handling on correct properties given', () => {
            it('should correctly create a contribution model object', () => {
                // given
                const contribution = new Contribution({
                    userId: '5996a4851c8ce12abd2a4f5b',
                    eventId: '5996a4851c8ce12abd2a4f5a',
                });

                // when
                const validation = contribution.validateSync();

                // then
                expect(validation).to.be.undefined;
            });
        });

    });
});
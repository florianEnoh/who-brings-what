require('rootpath')();
const { describe, it, expect } = require('tests/helper');
const Event = require('app/domain/models/event');

describe('Unit | Model | Event Schema ', function() {

    describe('Event schema', () => {
        it('should exist', () => {
            // when
            const event = new Event({});

            // then
            expect(event).to.be.an.instanceof(Event);
        });

        describe('description', () => {

            it('should require a hostId (ObjectId)', () => {
                // given
                const event = new Event({
                    hostId: '5996a4851c8ce12abd2a4f5a'
                });

                // when
                const validation = event.validateSync();

                // then
                expect(validation.errors).to.not.include.keys('hostId');
            });

            it('should require a title (String)', () => {
                // given
                const event = new Event({
                    title: 'event title'
                });

                // when
                const validation = event.validateSync();

                // then
                expect(validation.errors).to.not.include.keys('title');
            });
        });

        describe('Error handling on bad properties given', () => {

            it(`should get an error, when only hostId (ObjectId) is provided`, () => {
                // given
                const event = new Event({
                    hostId: 'eventId'
                });

                // when
                const validation = event.validateSync();

                // then
                expect(validation.errors).to.include.keys('title');
                expect(validation.errors['title'].message).to.eql('A title is required');
            });

            it(`should get an error, when only title (ObjectId) is provided`, () => {
                // given
                const event = new Event({
                    title: 'event title'
                });

                // when
                const validation = event.validateSync();

                // then
                expect(validation.errors).to.include.keys('hostId');
                expect(validation.errors['hostId'].message).to.eql('A host is required');
            });
        });

        describe('Success handling on good properties given', () => {

            it(`should correctly create an event`, () => {
                // given
                const event = new Event({
                    title: 'event title',
                    hostId: '5996a4851c8ce12abd2a4f5a'
                });

                // when
                const validation = event.validateSync();

                // then
                expect(validation).to.be.undefined;
            });
        });
    });
});
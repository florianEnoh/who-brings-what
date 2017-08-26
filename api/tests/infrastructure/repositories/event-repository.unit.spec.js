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
                    return expect(result).to.eql('FGOP1!');
                });

            });

        });


    });
});
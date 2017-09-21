require('rootpath')();
const { describe, it, expect, server, sinon, beforeEach, afterEach } = require('tests/helper');
const contributionService = require('app/domain/services/contribution-service');
const contributionRepository = require('app/infrastructure/repositories/contribution-repository');

describe('Unit | Service | Contribution ', function() {


    describe('#add', () => {

        let sandbox;

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(contributionRepository, 'addNew');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should be a function', () => {
            // then
            expect(contributionService.add).to.be.a('function');
        });

        it('should add a new contribution for an event by calling contribution repository', (done) => {
            // given
            contributionRepository.addNew.resolves();
            const eventId = 7;
            const guestId = 5;
            const involvements = [{
                name: 'Yakitori',
                quantity: 5
            }];
            const contribution = {
                eventId,
                userId: guestId,
                involvements
            };

            // when
            const promise = contributionService.add(guestId, eventId, involvements);

            // then
            promise.then(() => {
                sinon.assert.calledWith(contributionRepository.addNew, contribution);
                done();
            });
        });

        it('should not add a new contribution for an event, when involvements is empty', () => {
            // given
            contributionRepository.addNew.resolves();
            const eventId = 7;
            const guestId = 5;
            const involvements = [];
            const contribution = {
                eventId,
                userId: guestId,
                involvements
            };

            // when
            const promise = contributionService.add(guestId, eventId, involvements);

            // then
            return promise.then(() => {
                sinon.assert.notCalled(contributionRepository.addNew);
            });
        });
    });
});
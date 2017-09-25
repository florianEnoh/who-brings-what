require('rootpath')();
const { describe, it, expect, sinon, beforeEach, afterEach } = require('tests/helper');
const contributionRepository = require('app/infrastructure/repositories/contribution-repository');
const Contribution = require('app/domain/models/contribution');

describe('Unit | Repository | Contribution ', function() {

    describe('#addNew', () => {

        it('should be a function', () => {
            // then
            expect(contributionRepository.addNew).to.be.a('function');
        });


        describe('saving behavior', () => {

            beforeEach(() => {
                sinon.stub(Contribution.prototype, 'save');
                sinon.spy(contributionRepository, 'addNew');
            });

            afterEach(() => {
                Contribution.prototype.save.restore();
            });

            it('should save a new contribution', () => {
                // given
                Contribution.prototype.save.resolves();
                const contribution = {
                    eventId: '59a44b6a3da2072062fb8b0d',
                    guestId: '59a99ae48cd3ab825c3aad69',
                    involvements: [{ name: 'chips', quantity: '10', category: 'Snacks' }]
                };

                // when
                const promise = contributionRepository.addNew(contribution);

                // then
                return promise.then(() => {
                    sinon.assert.calledOnce(Contribution.prototype.save);
                    sinon.assert.calledWith(contributionRepository.addNew, contribution);
                });
            });
        });

    });
});
require('rootpath')();
const { describe, it, expect, sinon, beforeEach, afterEach } = require('tests/helper');
const UserRepository = require('app/infrastructure/repositories/user-repository');
const User = require('app/domain/models/user');

describe('Unit | Repositories | User ', function() {

    describe('#save', () => {
        const user = { username: 'flo' };

        it('should be a function', () => {
            // then
            expect(UserRepository.save).to.be.a('function');
        });

        describe('saving behavior', () => {
            let sandbox;
            const saveSpy = sinon.spy();
            const UserModel = () => {
                save: saveSpy
            }
            beforeEach(() => {
                sandbox = sinon.sandbox.create();
                sandbox.stub(User.prototype, 'save');
            });

            afterEach(() => {
                sandbox.restore();
            });

            it('should call User model', () => {
                // given
                User.prototype.save.callsArgWith(0, null, { _id: '333' });
                // when
                const promise = UserRepository.save(user);

                // then
                return promise.then((result) => {
                    sinon.assert.calledOnce(User.prototype.save);
                    return expect(result).to.eql('333');
                });

            });
        });


    });
});
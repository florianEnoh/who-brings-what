require('rootpath')();
const { describe, it, expect, sinon, beforeEach, afterEach } = require('tests/helper');
const UserRepository = require('app/infrastructure/repositories/user-repository');
const User = require('app/domain/models/user');

describe('Unit | Repository | User ', function() {

    describe('#save', () => {
        const user = { username: 'flo' };

        it('should be a function', () => {
            // then
            expect(UserRepository.save).to.be.a('function');
        });

        describe('saving behavior', () => {

            beforeEach(() => {
                sinon.stub(User.prototype, 'save');
            });

            afterEach(() => {
                User.prototype.save.restore();
            });

            it('should call User model', () => {
                // given
                User.prototype.save.resolves({ username: 'flo', _id: '333' });
                // when
                const promise = UserRepository.save(user);

                // then
                return promise.then((user) => {
                    sinon.assert.calledOnce(User.prototype.save);
                    return expect(user).to.eql({ username: 'flo', _id: '333' });
                });

            });
        });


    });
});
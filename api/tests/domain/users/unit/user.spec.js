require('rootpath')();
const { describe, it, expect } = require('tests/helper');
const User = require('app/domain/models/user');

describe('Unit | Model | User Schema ', function() {

    describe('User schema', () => {

        it('should exist', () => {
            // when
            const user = new User({});

            // then
            expect(user).to.be.an.instanceof(User);
        });

        describe('Validattions', () => {

            it('should be invalid, when username is empty', () => {
                // then
                const user = new User({});

                // when
                const validation = user.validateSync();

                // then
                expect(validation.errors.username).to.exist;
            });

            it('should be valid, when username is not empty', () => {
                // then
                const user = new User({ username: 'Conqueror' });

                // when
                const validation = user.validateSync();

                // then
                expect(validation).to.be.undefined;
            });
        });

    });
});
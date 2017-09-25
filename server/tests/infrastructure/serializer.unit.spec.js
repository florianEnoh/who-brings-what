require('rootpath')();
const { describe, it, expect, sinon, beforeEach, afterEach } = require('tests/helper');
const Serializer = require('app/infrastructure/serializer');

describe('Unit | Infrastructure | Serializer  ', function() {

    describe('#serializeError', () => {

        it('should be a function', () => {
            // then
            expect(Serializer.serializeError).to.be.a('function');
        });

        it('should convert an error into an Array of more readable object', (done) => {
            // given
            const expectedSerializedError = {
                code: 422,
                data: {
                    'errors': [{
                        'status': '400',
                        'type': 'ValidatorError',
                        'detail': 'Validator failed for path `email` with value `flo@`',
                        'meta': {
                            'field': 'email'
                        }
                    }]
                }
            };

            const error = {
                errors: {
                    email: {
                        ValidatorError: 'Validator failed for path `email`',
                        message: 'Validator failed for path `email` with value `flo@`',
                        name: 'ValidatorError',
                        properties: [Object],
                        kind: 'user defined',
                        path: 'email',
                        value: 'flo@',
                        reason: undefined,
                        '$isValidatorError': true
                    }
                },
                _message: 'User validation failed',
                name: 'ValidationError'
            };

            // when
            const serializedError = Serializer.serializeError(error);

            // then
            expect(serializedError).to.eql(expectedSerializedError);
            done();
        });


        it('should convert array of errors into an Array of multiple readable object', (done) => {
            // given
            const expectedSerializedError = {
                code: 422,
                data: {
                    'errors': [{
                            'status': '400',
                            'type': 'ValidatorError',
                            'detail': 'Validator failed for path `email` with value `flo@`',
                            'meta': {
                                'field': 'email'
                            }
                        },
                        {
                            'status': '400',
                            'type': 'CastError',
                            'detail': 'CastError failed for path `title` with value `undefined`',
                            'meta': {
                                'field': 'title'
                            }
                        }
                    ]
                }
            };

            const error = {
                errors: {
                    email: {
                        ValidatorError: 'Validator failed for path `email`',
                        message: 'Validator failed for path `email` with value `flo@`',
                        name: 'ValidatorError',
                        properties: [Object],
                        kind: 'user defined',
                        path: 'email',
                        value: 'flo@',
                        reason: undefined,
                        '$isValidatorError': true
                    },
                    title: {
                        ValidatorError: 'Validator failed for path `title`',
                        message: 'CastError failed for path `title` with value `undefined`',
                        name: 'CastError',
                        properties: [Object],
                        kind: 'user defined',
                        path: 'title',
                        value: '',
                        reason: undefined,
                        '$CastError': true
                    }
                },
                _message: 'User validation failed',
                name: 'ValidationError'
            };

            // when
            const serializedError = Serializer.serializeError(error);

            // then
            expect(serializedError).to.eql(expectedSerializedError);
            done();
        });

        it('should not convert unknow errors', (done) => {
            // given
            const error = new Error();
            const expectedSerializedError = {
                code: 500,
                data: { error }
            };

            // when
            const serializedError = Serializer.serializeError(error);

            // then
            expect(serializedError).to.eql(expectedSerializedError);
            done();
        });
    });
});
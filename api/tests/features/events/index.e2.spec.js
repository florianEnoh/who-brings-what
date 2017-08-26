require('rootpath')();
const { describe, it, expect, afterEach, beforeEach } = require('tests/helper');
const route = require('app/features/events');

describe('Acceptance | Route | Event - Index ', function() {

    let server;

    beforeEach(() => {
        server = require('server').BootStrapTestHelper('events');
    });

    afterEach(() => {
        server.stop();
    });


    describe('Post /api/events', () => {

        describe('when all parameters are goods', () => {

            it('should response with 201 HTTP status code');
            it('should response with event url');
            it('should return a json');

        });

        describe('Errors cases', () => {

            it('should response with 400 and serialized error, when no payload');

            it('should response with 422 and serialized error, when at least one parameter is bad');

            it('should response with 422 and array of serialized error, when many error has occured');

            it('should response with 500 and serialized error, when an unknown error has occured');

        });

    });
});
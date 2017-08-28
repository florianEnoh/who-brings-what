require('rootpath')();
const { describe, it, expect, afterEach, beforeEach, sinon } = require('tests/helper');
const route = require('app/features/events');
const eventService = require('app/domain/services/event-service');

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

            it('should response with 201 HTTP status code, with an url json object', (done) => {
                // when
                server.inject({
                    method: 'POST',
                    url: '/api/events',
                    payload: {
                        host: {
                            username: 'Hypernikao'
                        },
                        event: {
                            title: 'New potluck'
                        }
                    }
                }).then((res) => {
                    // then
                    expect(res.statusCode).to.equal(201);
                    expect(res.result).to.include.keys('url');
                    done();
                });
            });

        });

        describe('Errors cases', () => {

            it('should response with 400 and serialized error, when no payload', () => {
                // when
                return server.inject({
                    method: 'POST',
                    url: '/api/events',
                    payload: {
                        event: {}
                    }
                }).then((res) => {
                    // then
                    expect(res.statusCode).to.equal(400);
                });
            });

            it('should response with 422 and serialized error, when at least one parameter is bad', () => {
                // when
                return server.inject({
                    method: 'POST',
                    url: '/api/events',
                    payload: {
                        host: {},
                        event: {}
                    }
                }).then((res) => {
                    // then
                    expect(res.statusCode).to.equal(422);
                });
            });

        });

    });
});
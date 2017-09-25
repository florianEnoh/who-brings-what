require('rootpath')();
const { describe, it, expect, afterEach, beforeEach, sinon } = require('tests/helper');
const route = require('app/features/events');
const eventService = require('app/domain/services/event-service');

describe('Acceptance | Route | Event - Index ', function() {

  let server;
  let generatedEventCode;

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
          expect(res.result.title).to.equal('New potluck');
          expect(res.result.hostId).to.exist;
          expect(res.result.code).to.exist;
          expect(res.result.needs).to.exist;
          generatedEventCode = res.result.code;
          done();
        });
      });

    });

    describe('Errors cases', () => {

      it('should response with 400 and serialized error, when no payload', (done) => {
        // when
        server.inject({
          method: 'POST',
          url: '/api/events',
          payload: {
            event: {}
          }
        }).then((res) => {
          // then
          expect(res.statusCode).to.equal(400);
          done();
        });
      });

      it('should response with 422 and serialized error, when at least one parameter is bad', (done) => {
        // when
        server.inject({
          method: 'POST',
          url: '/api/events',
          payload: {
            host: {},
            event: {}
          }
        }).then((res) => {
          // then
          expect(res.statusCode).to.equal(422);
          done();
        });
      });

    });

  });

  describe('Post /api/events/{code}/guests', () => {

    describe('when all parameters are goods', () => {

      it('should response with 201 HTTP status code, with created event', (done) => {
        // when
        server.inject({
          method: 'POST',
          url: `/api/events/${generatedEventCode}/guests`,
          payload: {
            guest: {
              username: 'Hypernikao'
            },
            contribution: []
          }
        }).then((res) => {
          // then
          expect(res.statusCode).to.equal(201);
          done();
        });
      });
    });

    describe('Errors cases', () => {

      it('should response with 400 and serialized error, when no or empty payload', () => {
        // when
        return server.inject({
          method: 'POST',
          url: '/api/events/123456677889FFFFF/guests',
          payload: {}
        }).then((res) => {
          // then
          expect(res.statusCode).to.equal(400);
        });
      });

      it('should response with 404 and serialized error, when event code doesn’t exist', () => {
        // when
        return server.inject({
          method: 'POST',
          url: '/api/events/7/guests',
          payload: {
            guest: {
              username: 'fakeGuest'
            },
            contribution: []
          }
        }).then((res) => {
          // then
          expect(res.statusCode).to.equal(404);
        });
      });

      it('should response with 422 and serialized error, when at least one parameter is bad', () => {
        // when
        return server.inject({
          method: 'POST',
          url: `/api/events/${generatedEventCode}/guests`,
          payload: {
            guest: {
              username: null
            },
            contribution: []
          }
        }).then((res) => {
          // then
          expect(res.statusCode).to.equal(422);
        });
      });

    });

  });

  describe('GET /api/events/{code}', () => {

    it('should response with 200 HTTP status code, with aggregated event', () => {
      return server.inject({
        method: 'GET',
        url: `/api/events/${generatedEventCode}`,
        payload: {}
      }).then((res) => {
        // then
        expect(res.statusCode).to.equal(200);
      });
    });

    describe('Errors cases', () => {

      it('should response with 404 and serialized error, when event code doesn’t exist', () => {
        // when
        return server.inject({
          method: 'POST',
          url: '/api/events/7',
          payload: {}
        }).then((res) => {
          // then
          expect(res.statusCode).to.equal(404);
        });
      });
    });
  });
});
jest.mock('../../src/shift/service.js');
jest.mock('sequelize');
const service = require.requireMock('../../src/shift/service.js');
const Joi = require('joi');

const it = test;

var route;
var server;
var request;
var h;
var code;

describe('the plugin', () => {

  const uut = require('../../src/shift/index');

  describe('when registered', () => {

    beforeEach(() => {

      server = {
        route: jest.fn()
      };

      uut.register(server);
    });

    describe('the first route', () => {

      beforeEach(() => {
        route = server.route.mock.calls[0][0];
      });

      it('has a method of "GET"', () => {
        expect(route.method).toEqual('GET');
      });

      it('has a path of "/"', () => {
        expect(route.path).toEqual('/');
      });

      it('has an auth strategy of "session"', () => {
        expect(route.config.auth).toEqual('session')
      });

      describe('the handler', () => {
        describe('when called', () => {

          beforeEach(() => {

            service.findAll = jest.fn().mockReturnValue('some shifts');

            h = {
              view: jest.fn()
            };

            route.handler(request, h);
          });

          it('uses the service to find all the shifts', () => {
            expect(service.findAll.mock.calls.length).toBe(1);
          });

          it('returns the "shift/list.html" view', () => {
            expect(h.view.mock.calls[0][0]).toEqual('shift/list.html');
          });

          describe('that view', () => {

            it('contains the data returned from the service', () => {
              expect(h.view.mock.calls[0][1]).toEqual({shifts: 'some shifts'});
            });
          });
        });
      });
    });

    describe('the second route', () => {

      beforeEach(() => {
        route = server.route.mock.calls[1][0];
      });

      it('has a method of "POST"', () => {
        expect(route.method).toEqual('POST');
      });

      it('has a path of "/"', () => {
        expect(route.path).toEqual('/');
      });

      it('has an auth strategy of "simple"', () => {
        expect(route.config.auth).toEqual('simple')
      });

      describe('the payload', () => {

        it('has a required start date', () => {

          const expected = Joi.describe(Joi.date().iso().max('now').required());
          const actual = Joi.describe(route.config.validate.payload.start);
          expect(actual).toEqual(expected);

        });

        it('has a required end date', () => {

          const expected = Joi.describe(Joi.date().iso().min(Joi.ref('start')).max('now').required());
          const actual = Joi.describe(route.config.validate.payload.end);
          expect(actual).toEqual(expected);

        });

      });

      describe('the handler', () => {
        describe('when called', () => {

          beforeEach(() => {

            request = {
              payload: {
                start: 'some date',
                end: 'some other date'
              },
              auth: {
                credentials: {
                  username: 'some username'
                }
              },
              log: jest.fn()
            };

            code = jest.fn();

            h = {
              response: jest.fn().mockReturnValue({
                code: code
              })
            };

            route.handler(request, h);
          });

          it('saves the information into the service', () => {
            expect(service.save.mock.calls.length).toEqual(1);
          });

          describe('that save call', () => {

            var call;

            beforeEach(() => {
              call = service.save.mock.calls[0];
            });

            it('passes the given start date to the service', () => {
              expect(call[0].start).toEqual('some date');
            });

            it('passes the given end date to the service', () => {
              expect(call[0].end).toEqual('some other date');
            });

            it('passes the authenticated user\'s username to the service', () => {
              expect(call[0].username).toEqual('some username');
            });

          });

          it('responds with 201 statusCode', () => {
            expect(code.mock.calls[0][0]).toEqual(201);
          });

          it('responds with a success message', () => {
            expect(h.response.mock.calls[0][0].message)
            .toEqual(`Thank you for entering your shift. Your shift was NaN hours`);
          });
        });


      });
    });

    describe('the third route', () => {

      beforeEach(() => {
        route = server.route.mock.calls[2][0];
      });

      it('has a method of "POST"', () => {
        expect(route.method).toEqual('POST');
      });

      it('has a path of "/{id}/approve"', () => {
        expect(route.path).toEqual('/{id}/approve');
      });

      it('has an auth strategy of "session"', () => {
        expect(route.config.auth).toEqual('session')
      });

      describe('the handler', () => {
        describe('when called', () => {

          beforeEach(() => {

            service.update.mockClear();

            request = {
              params: {
                id: 'some id'
              },
              auth: {
                credentials: {
                  username: 'some username'
                }
              },
            };

            h = {
              redirect: jest.fn()
            };

            route.handler(request, h);
          });

          it('updates the shift', () => {
            expect(service.update.mock.calls.length).toEqual(1);
          });

          describe('that update call', () => {

            var call;

            beforeEach(() => {
              call = service.update.mock.calls[0];
            });

            it('passes id from the route to the service', () => {
              expect(call[0].id).toEqual('some id');
            });

            it('passes the reviewer to the service', () => {
              expect(call[0].reviewer).toEqual('some username');
            });

            it('passes state of approved to the service', () => {
              expect(call[0].state).toEqual('approved');
            });
          });

          it('redirects to "/shift"', () => {
            expect(h.redirect.mock.calls[0][0]).toEqual('/shift')
          });
        });
      });
    });

    describe('the fourth route', () => {

      beforeEach(() => {
        route = server.route.mock.calls[3][0];
      });

      it('has a method of "POST"', () => {
        expect(route.method).toEqual('POST');
      });

      it('has a path of "/{id}/approve"', () => {
        expect(route.path).toEqual('/{id}/reject');
      });

      it('has an auth strategy of "session"', () => {
        expect(route.config.auth).toEqual('session')
      });

      describe('the handler', () => {
        describe('when called', () => {

          beforeEach(() => {

            service.update.mockClear();

            request = {
              params: {
                id: 'some id'
              },
              auth: {
                credentials: {
                  username: 'some username'
                }
              },
            };

            h = {
              redirect: jest.fn()
            };

            route.handler(request, h);
          });

          it('updates the shift', () => {
            expect(service.update.mock.calls.length).toEqual(1);
          });

          describe('that update call', () => {

            var call;

            beforeEach(() => {
              call = service.update.mock.calls[0];
            });

            it('passes id from the route to the service', () => {
              expect(call[0].id).toEqual('some id');
            });

            it('passes the reviewer to the service', () => {
              expect(call[0].reviewer).toEqual('some username');
            });

            it('passes state of rejected to the service', () => {
              expect(call[0].state).toEqual('rejected');
            });
          });

          it('redirects to "/shift"', () => {
            expect(h.redirect.mock.calls[0][0]).toEqual('/shift')
          });
        });
      });
    });
  });
});
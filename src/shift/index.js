const service = require('./service');
const Joi = require('joi');

exports.register = (server) => {

  server.route({
    method: 'GET',
    path: '/',
    config: {
      tags: ['api', 'webapp'],
      auth: 'session'
    },
    handler: async (request, h) => {

      const data = await service.findAll();

      return h.view('shift/list.html', {
        shifts: data
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/',
    config: {
      tags: ['api', 'client'],
      auth: 'simple',
      validate: {
        payload: {
          start: Joi.date().iso().max('now').required(),
          end: Joi.date().iso().min(Joi.ref('start')).max('now').required()
        }
      }
    },
    handler: async (request, h) => {

      request.log(['info'], {
        message: 'hello'
      });

      const start = request.payload.start;
      const end = request.payload.end;

      await service.save({
        start: start,
        end: end,
        username: request.auth.credentials.username
      });

      let hours = ((end.valueOf() - start.valueOf())/1000/60/60).toFixed(2);

      return h.response({
        message: `Thank you for entering your shift. Your shift was ${hours} hours`
      }).code(201);
    }
  });

  server.route({
    method: 'POST',
    path: '/{id}/approve',
    config: {
      tags: ['api', 'webapp'],
      auth: 'session'
    },
    handler: async (request, h) => {

      await service.update({
        id: request.params.id,
        reviewer: request.auth.credentials.username,
        state: 'approved'
      });
      return h.redirect('/shift');
    }
  });

  server.route({
    method: 'POST',
    path: '/{id}/reject',
    config: {
      tags: ['api', 'webapp'],
      auth: 'session'
    },
    handler: async (request, h) => {

      await service.update({
        id: request.params.id,
        reviewer: request.auth.credentials.username,
        state: 'rejected'
      });
      return h.redirect('/shift');
    }
  });

};

exports.pkg = {
  name: "manager"
};
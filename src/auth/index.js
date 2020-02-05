const config = require('getconfig').auth;
const service = require('./service');

exports.register = async function (server) {

  await server.register(require('bell'));
  await server.register(require('hapi-auth-basic'));
  await server.register(require('hapi-auth-cookie'));

  server.auth.strategy('simple', 'basic', {
    validate: service.validate
  });

  server.auth.strategy('azure', 'bell', config.azure);

  server.auth.strategy('session', 'cookie', config.session);

  server.route({
    method: 'GET',
    path: '/azure/login',
    options: {
      auth: 'azure',
      handler: function (request, h) {

        if (!request.auth.isAuthenticated) {
          return `Authentication failed due to: ${request.auth.error.message}`;
        }

        request.cookieAuth.set({
          username: request.auth.credentials.profile.email
        });

        const next = request.auth.credentials.query.next ?
          request.auth.credentials.query.next : '/home';

        return h.redirect(next);
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/logout',
    config: {
      auth: 'session',
    },
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect('/');
    }
  });
};

exports.pkg = {
  name: 'auth'
};
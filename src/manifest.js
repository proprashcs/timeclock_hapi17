const Path = require('path');

module.exports = {
  server: {
    port: 8000,
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'public')
      }
    }
  },
  register: {
    plugins: [
      {
        plugin: require('hapi-swagger'),
        options: {
          grouping: 'tags',
          host: 'localhost:8000',
          jsonEditor: true,
          info: {
            contact: {
              name: 'Jeff Taylor',
              email: 'putemailhere@gmail.com'
            }
          }
        }
      },
      {
        plugin: require('inert')
      },
      {
        plugin: 'vision',
        options: {
          engines: {
            html: require('handlebars')
          },
          path: __dirname,
          layout: true,
          layoutPath: 'src/templates/layouts',
          helpersPath: 'src/templates/helpers',
          context: (request) => {
            return {
              credentials: request.auth.credentials
            }
          }
        }
      },
      {
        plugin: require('./logging')
      },
      {
        plugin: require('./auth')
      },
      {
        plugin: require('./home')
      },
      {
        plugin: require('./shift'),
        routes: {
          prefix: '/shift'
        }
      }
    ]
  }
};
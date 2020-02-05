const config = require('getconfig').logging;


exports.register = async (server) => {

  const options = {
    includes: {
      request: ['headers', 'payload'],
      response: ['headers', 'payload'],
    },
    ops: {
      interval: 1000
    },
    reporters: {
      myConsoleReporter: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{log: '*', response: '*', ops: '*', request: '*'}]
      }, {
        module: 'good-console'
      }, 'stdout'],
      fileReporter: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{response: '*'}]
      }, {
        module: 'white-out',
        args: [{
          authorization: 'censor',
        }, {
          root: 'headers'
        }]
      },
        {
          module: 'good-squeeze',
          name: 'SafeJson'
        }, {
          module: 'good-file',
          args: ['logfile']
        }],
      splunkReporter: [
        {
          module: 'good-squeeze',
          name: 'SafeJson'
        }, {
          module: 'good-http',
          args: [config.splunk.url, {
            wreck: {
              headers: {'Authorization': `Splunk ${config.splunk.token}`},
              rejectUnauthorized: false
            }
          }]
        }]
    }
  };

  await server.register({
    plugin: require('good'),
    options
  });

};

exports.pkg = {
  name: "logging"
};
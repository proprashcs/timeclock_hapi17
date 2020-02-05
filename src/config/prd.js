module.exports = {
  auth: {
    azure: {
      clientId: 'someotherid',
      clientSecret: '$AZURE_SECRET',
      config: {
        tenant: 'someothertenant'
      },
      isSecure: true
    },
    session: {
      password: '$SESSION_PASSWORD',
      isSecure: true
    }
  },
  logging: {
    splunk: {
      token: 'someothertoken'
    }
  },
  database: {
    host: '$DB_URL',
    port: '$DB_PORT',
    database: '$DB_NAME',
    username: '$DB_USER',
    password: '$DB_PASSWORD'
  }
};
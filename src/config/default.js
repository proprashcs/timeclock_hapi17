module.exports = {
  auth: {
    azure: {
      provider: 'azuread',
      password: 'cookie_encryption_password_secure',
      clientId: 'acaf8006-6c4a-47cf-908d-39e2dcb23250',
      clientSecret: '832oEQJGTOFwQ5TFXIuuwQDmliAFdlphUIqfz62rR6Y=',
      config: {
        tenant: '713149d8-674d-475a-9adb-8f7dac809039'
      },
      isSecure: false
    },
    session: {
      password: 'password-should-be-32-characters',
      redirectTo: '/',
      appendNext: true,
      isSecure: false
    }
  },
  logging: {
    splunk: {
      url: 'https://input-prd-p-m8rqskwck8l7.cloud.splunk.com:8088/services/collector/raw',
      token: '6d64d823-228a-4923-a5ad-1e2842e65c89'
    }
  },
  database: {
    host: 'localhost',
    port: 3307,
    database: 'timeclock',
    username: 'dbuser',
    password: 'changeme'
  }
};
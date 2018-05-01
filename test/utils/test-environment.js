const jwt = require('jsonwebtoken');
const NodeEnvironment = require('jest-environment-node');

// can be found in ~/src/auth/index.js
// not 'required' due to jest no knowing how to read es6 modules
const namespace = 'https://www.freecodecamp.org/';

const { JWT_CERT } = process.env;

class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    this.global.__MONGO_URI__ = await global.__MONGOD__.getConnectionString();
    this.global.__MONGO_DB_NAME__ = global.__MONGO_DB_NAME__;

    const token = jwt.sign(
      {
        id: 123,
        name: 'Charlie',
        email: 'charlie@thebear.me',
        [namespace +
        'accountLinkId']: 'a-very-unique-string-for-charlie@thebear.me'
      },
      JWT_CERT
    );
    const headers = {
      'Content-Type': 'application/json'
    };

    this.global.mockedContextWithOutToken = { headers: headers };

    const headersWithValidToken = {
      ...headers,
      Authorization: 'Bearer ' + token
    };
    this.global.mockedContextWithValidToken = {
      headers: headersWithValidToken
    };

    const headersWithInValidToken = {
      ...headers,
      Authorization: 'Bearer 123'
    };
    this.global.mockedContextWithInValidToken = {
      headers: headersWithInValidToken
    };

    await super.setup();
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = MongoEnvironment;

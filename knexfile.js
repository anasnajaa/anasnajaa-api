require('dotenv').config();
const environment = process.env.NODE_ENV;
const stage = require('./config/index')[environment];
const prodSettingsFromUrl = ()=>{
  const dbUrl = stage.postgressUri;
  const parsedDbUrl = dbUrl.split("//")[1].split(":");
  const passwordAndDomain = parsedDbUrl[1].split("@");
  const portAndDatabase = parsedDbUrl[2].split("/");
  return {
    client: 'postgresql',
    connection: {
      host: passwordAndDomain[1],
      user: parsedDbUrl[0],
      password: passwordAndDomain[0],
      database: portAndDatabase[1],
      port: portAndDatabase[0],
      ssl: {
        rejectUnauthorized: false,
      },
      idleTimeoutMillis: 30000
    },
    pool: { min: 5, max: 20 },
    migrations: {
      tableName: 'knex_migrations'
    }
  };
};

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      database: 'anasnajaa',
      port: 5432,
      idleTimeoutMillis: 30000,
    },
    pool: { min: 5, max: 10 },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: prodSettingsFromUrl()
  // {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }

};

// require('dotenv').config();
// const environment = process.env.NODE_ENV;
// const stage = require('./index')[environment];
// const parsePostgressUrl = ()=>{
//   const dbUrl = stage.postgressUri;
//   const parsedDbUrl = dbUrl.split("//")[1].split(":");
//   const passwordAndDomain = parsedDbUrl[1].split("@");
//   const portAndDatabase = parsedDbUrl[2].split("/");
//   return {
//     host: passwordAndDomain[1],
//     user: parsedDbUrl[0],
//     password: passwordAndDomain[0],
//     database: portAndDatabase[1],
//     port: portAndDatabase[0],
//     pool: { min: 5, max: 20 },
//     idleTimeoutMillis: 30000,
//     ssl: {
//       rejectUnauthorized: false,
//     }
//   };
// };

// module.exports = {
//     client: 'pg',
//     connection: parsePostgressUrl()
// }

require('dotenv').config();
const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[environment];
module.exports = require('knex')(config);
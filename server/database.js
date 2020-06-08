const Pool = require("pg").Pool;
const config = require("config")

const pool = new Pool({
  max: config.get("database.connection_limit"),
  user: config.get("database.user"),
  host: config.get("database.host"),
  database: config.get("database.database"),
  password: config.get("database.db_password"),
  port: config.get("database.port"),
});
pool.on('error', (error) => {
  console.error('Unexpected error on idle client', error);
  process.exit(-1);
});
module.exports = pool
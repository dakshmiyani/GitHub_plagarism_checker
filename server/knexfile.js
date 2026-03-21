require("dotenv").config();

module.exports = {

  api_write: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 0,
      max: 10,
      idleTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
    },
    migrations: {
      directory: "./src/models/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },
  development: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 0,
      max: 10,
      idleTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
    },
    migrations: {
      directory: "./src/models/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },

  production: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 0,
      max: 2,
    },
    migrations: {
      directory: "./src/models/migrations",
      tableName: "knex_migrations",
    },
  },
};

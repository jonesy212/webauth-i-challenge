// Update with your config settings.

//require field is to be able to
//hide file when sending to github.
require('dotenv').config()
const dbConnect = process.env.DB_CONNECT || 'postgres://marcus@localhost:5432/postgres'

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3',
      
    }
  },

  staging: {
    client: 'pg',
    connection: dbConnect,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};

require('dotenv').config();
const knexFileObject = require("../../../knexfile");
const { types } = require("pg");

// Force DATE (OID 1082) to be read as string to prevent timezone conversion issues
types.setTypeParser(1082, (str) => str);

class Db {
    constructor() {
        this.queryBuilder = this._initQueryBuilder();
    }

    _initQueryBuilder() {
        const dbConfig = process.env.DB_CONNECTION || "api_write"
        return require("knex")(knexFileObject[dbConfig]);
    }

    getQueryBuilder() {
        return this.queryBuilder;
    }

    getTransactionProvider() {
        return this.getQueryBuilder().transactionProvider();
    }
}

module.exports = new Db();
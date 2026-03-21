require("dotenv").config();
const { TABLE_DEFAULTS } = require("./dbConstants");
const Db = require("./Db");

class BaseModel {
    constructor(userId, dbname = null, isRead = false) {
        this.userId = userId;
    }

    async getQueryBuilder() {
        return Db.getQueryBuilder();
    }

    getUserId() {
        return this.userId;
    }

    /**
     * Adds audit fields during INSERT
     */
    insertStatement(insertObj) {
        const userId = this.getUserId();

        if (!userId) {
            return insertObj;
        }

        return {
            ...insertObj,
            [TABLE_DEFAULTS.COLUMNS.CREATED_BY.KEY]: userId
        };
    }

    /**
     * Helper insert for bulk rows
     */
    insertArrayStatement(rows) {
        return rows.map(r => this.insertStatement(r));
    }

    /**
     * Adds audit fields during UPDATE
     */
    async updateStatement(updateObj) {
        const userId = this.getUserId();
        // const queryBuilder = await this.getQueryBuilder();

        if (!userId) {
            return updateObj;
        }

        return {
            ...updateObj,
            [TABLE_DEFAULTS.COLUMNS.LAST_MODIFIED_BY.KEY]: userId
        };
    }

    /**
     * Common WHERE clause (soft delete support)
     */
    whereStatement(whereObj = {}) {
        return {
            [TABLE_DEFAULTS.COLUMNS.IS_DELETED.KEY]: false,
            ...whereObj
        };
    }

    /**
     * Removes undefined values
     */
    getDefinedObject(object) {
        const definedObject = {};

        for (const key in object) {
            if (object[key] !== undefined) {
                definedObject[key] = object[key];
            }
        }

        return definedObject;
    }


}

module.exports = BaseModel;

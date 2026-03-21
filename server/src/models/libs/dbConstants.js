const PUBLIC_SCHEMA = "public";
const FIELD_TYPE = {
  STRING: "string",
  INTEGER: "integer",
  BIGINT: "bigint",
  DOUBLE: "double",
  BOOLEAN: "boolean",
  ENUM: "enum",
  JSONB: "jsonb",
  DATE: "date",
  DATETIME: "date-time",
};

const TABLE_DEFAULTS = {
  COLUMNS: {
    CREATED_BY: {
      KEY: "created_by",
      TYPE: FIELD_TYPE.INTEGER,
    },
    LAST_MODIFIED_BY: {
      KEY: "last_modified_by",
      TYPE: FIELD_TYPE.INTEGER,
    },
    IS_DELETED: {
      KEY: "is_deleted",
      TYPE: FIELD_TYPE.BOOLEAN,
    },
    CREATED_AT: {
      KEY: "created_at",
      TYPE: FIELD_TYPE.DATETIME,
    },
    UPDATED_AT: {
      KEY: "updated_at",
      TYPE: FIELD_TYPE.DATETIME,
    },
    IS_ACTIVE: {
      KEY: "is_active",
      TYPE: FIELD_TYPE.BOOLEAN,
    },
  },
};


module.exports= {
    PUBLIC_SCHEMA,
    FIELD_TYPE,
    TABLE_DEFAULTS,
}
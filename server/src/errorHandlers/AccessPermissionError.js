const AppError = require("./AppError");

class AccessPermissionError extends AppError {
    constructor(message = "Access Denied") {
        super(message, 403, message);
        this.name = "AccessPermissionError";
    }
}

module.exports = AccessPermissionError;

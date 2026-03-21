const AppError = require("./AppError");

class AuthenticationError extends AppError {
    constructor(message = "Authentication Failed") {
        super(message, 401, message);
        this.name = "AuthenticationError";
    }
}

module.exports = AuthenticationError;

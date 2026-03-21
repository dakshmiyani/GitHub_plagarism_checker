class AppError extends Error {
    constructor(e, status, responseMsg, extras = {}) {
        super(e);
        this.status = status;
        this.responseMsg = responseMsg;
        this.extras = extras;
    }
}

module.exports = AppError;

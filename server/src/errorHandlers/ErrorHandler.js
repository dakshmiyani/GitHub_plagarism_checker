const AppError = require("./AppError");

class ErrorHandler {
    static handleError(err, req, res, next) {
        let logError = true;
        if (err && err.extras && err.extras.logError === false) {
            logError = false;
        }
        let body = null;
        try {
            body = JSON.stringify(req.body);
        } catch (err) {
            body = req.body;
        }
        if (logError) {
            const requestInfo = {
                "user_id": res?.locals?.userInfo?.['user']?.['user_id'] || 'anonymous',
                "app_version": req?.headers?.['x-fitistan-app-version'] || 'anonymous',
                "platform": req?.headers?.['x-fitistan-platform'] || 'anonymous',
                "tech": req?.headers?.['x-fitistan-tech'] || 'anonymous',
                "method": req.method,
                "path": req.path,
                "body": body,
                "query": req.query
            }

            console.error("[ErrorHandler] ", "requestInfo", requestInfo,  "err", err);
        }
        
        if (res.headersSent) {
            return next(err)
        }

        const status = err.status || 500;
        const message = (err instanceof AppError) ? err.responseMsg : (err.message || "Error occurred!");

        res.status(status).json({
            success: false,
            status: status,
            error: message,
            errorName: err.name || "Uncaught Error"
        });
    }
}

module.exports = ErrorHandler;

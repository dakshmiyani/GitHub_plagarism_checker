// server.js
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('node:path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const RouteMap = require('./src/routes/middleware/RouteMap');
const ErrorHandler = require('./src/errorHandlers/ErrorHandler');
const { PORT, IS_PRODUCTION } = require('./constants');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');

let corsOptions;
if (IS_PRODUCTION) {
    // TODO: Implement dynamic origins so as to accommodate all internal and third party domains
    corsOptions = {
        origin: function (origin, callback) {
            return callback(null, true);
        },
        credentials: true,
        optionsSuccessStatus: 200
    };
} else {
    corsOptions = {
        origin: function (origin, callback) {
            return callback(null, true);
        },
        credentials: true,
        optionsSuccessStatus: 200
    };
}

app.use(cors(corsOptions));

logger.token('user-id', (req, res) => res.locals.userInfo ? res.locals.userInfo['user']['user_id'] : 'anonymous');
logger.token('app-version', (req, res) => req.headers['x-fitistan-app-version'] || 'anonymous');
logger.token('platform', (req, res) => req.headers['x-fitistan-platform'] || 'anonymous');
logger.token('tech', (req, res) => req.headers['x-fitistan-tech'] || 'anonymous');

app.use(logger(':method :url :status :res[content-length] - :response-time ms - user-id=:user-id - app-version=:app-version - platform=:platform - tech=:tech'));

app.use(express.json({
    limit: "100mb",
    verify(req, res, buf, encoding) {
        req.rawBody = buf;
    },
}));
app.use(express.urlencoded({ limit: "100mb" }));

app.use(cookieParser());
app.use(fileUpload({
    limits: { fileSize: 20 * 1024 * 1024 },
}));
app.use(express.static(path.join(__dirname, 'public')));

// Swagger.setup(app);
RouteMap.setupRoutesAndAuth(app);

// error handler
app.use(ErrorHandler.handleError);

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
    next(createError(404));
});

app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});


module.exports = app;

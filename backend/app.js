require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
require('./app_api/models/db');
var apiRouter = require('./app_api/routes/index');
const e = require('express');
const passport = require('passport');
require('./app_api/config/passport');
var app = express();
app.use(passport.initialize());
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
};
app.use(allowCrossDomain);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRouter);

// Unauthorized / token errors from express-jwt
app.use((err, req, res, next) => {
    if (err && err.name === 'UnauthorizedError') {
        // Token has expired
        if (err.inner && err.inner.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 'Token süresi doldu', message: err.message });
        }
        // Any other token-related error
        return res.status(401).json({ status: 'Geçersiz token', message: err.message });
    }
    next(err);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;

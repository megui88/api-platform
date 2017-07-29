let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');

let platforms = require('./resources/routes');

let app = express();

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/platforms', platforms);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use( (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : '';

    // render the error page
    res.status(err.status || 500);
    res.json({'error': err});
});

module.exports = app;

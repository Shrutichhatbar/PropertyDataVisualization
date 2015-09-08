
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Database
var mongo = require('mongodb');
var monk = require('monk');

var crypto = require('crypto');
var MongoDB = require('mongodb').Db;
var Server = require('mongodb').Server;

var db = monk('mongodb://localhost:27017/mydb');
var accounts = db.get('aptdb');
var routes = require('./routes/index');

var app = express();

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    req.db = db;
    next();
});

app.use('/', routes);
var users = require('./routes/users');
app.use('/users', users);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users/getTotalCount', users.getTotalCount);
app.get('/users/propertylist', users.propertylist);
app.get('/users/propertylistByRegionRange', users.propertylistByRegionRange);
app.get('/users/updatebyregionorfilterchange', users.updatebyregionorfilterchange);
app.get('/users/getCountOnChange', users.getCountOnChange);


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

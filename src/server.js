
var secretKey = 'qsqodjcizeiufbvionkjqqsdfjhGJFJR76589964654jkhsdfskqdfglfser8754dgh4hjt54d89s6568765G+=)({}})',
db = {
    'host': process.env.MONGO_HOST ? process.env.MONGO_HOST : 'localhost',
    'port': '27017',
    'name': 'mapcontrib'
};



var fs = require('fs'),
path = require('path'),
Promise = require('es6-promise').Promise,
Api = require('./api'),
Passport = require('./passport'),
CONST = require('./public/js/const'),
settings = require('./public/js/settings'),
_ = require('underscore');




var MongoClient = require('mongodb').MongoClient,
init = require('./init.js'),
mongoUrl = 'mongodb://'+ db.host +':'+ db.port +'/'+ db.name;

MongoClient.connect(mongoUrl, function (err, db) {

    if(err) throw err;

    init.setDatabase(db);

    init.isDone().catch(function () {
        init.start().catch(function (err) {
            throw err;
        });
    });

    new Passport(app, db, settings);
    new Api(app, db, CONST);
});



var ejs = require('ejs'),
express = require('express'),
compression = require('compression'),
logger = require('morgan'),
multer = require('multer'),
methodOverride = require('method-override'),
session = require('express-session'),
bodyParser = require('body-parser'),
serveStatic = require('serve-static'),
cookieParser = require('cookie-parser'),
errorHandler = require('errorhandler'),
MongoStore = require('connect-mongo')(session),
app = express();

app.use(compression());
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({

    resave: true,
    saveUninitialized: true,
    secret: secretKey,
    store: new MongoStore({

        'host': db.host,
        'port': db.port,
        'db': db.name,
    }),
}));

app.set('port', process.env.PORT);
app.use(logger('dev'));
app.use(methodOverride());
app.use(multer({ 'dest': path.join(__dirname, 'upload') }));
app.use(serveStatic(path.join(__dirname, 'public')));



var dataDirectory = path.join(__dirname, 'upload');

if ( !fs.existsSync( dataDirectory ) ) {

    fs.mkdirSync(dataDirectory);
}




app.get('/', function (req, res) {

    res.redirect('/theme-s8c2d4');
});






if (app.get('env') !== 'production') {
    app.use(errorHandler());
}

app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


import path from 'path';
import _ from 'underscore';
import mkdirp from 'mkdirp';

import ejs from 'ejs';
import express from 'express';
import compression from 'compression';
import logger from 'morgan';
import multer from 'multer';
import methodOverride from 'method-override';
import session from 'express-session';
import bodyParser from 'body-parser';
import serveStatic from 'serve-static';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import connectMongo from 'connect-mongo';

import SERVER_CONST from './const';
import PUBLIC_CONST from './public/js/const';
import packageJson from '../package.json';
import config from 'config';
import Database from './database';
import Migrate from './migrate';
import Api from './api';
import Passport from './passport';


const CONST = _.extend(SERVER_CONST, PUBLIC_CONST);


if (!config.get('client.oauthConsumerKey')) {
    throw 'Error: client.oauthConsumerKey is not configured';
}

if (!config.get('client.oauthSecret')) {
    throw 'Error: client.oauthSecret is not configured';
}



let MongoStore = connectMongo(session);
let app = express();





app.use(compression());
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': true }));

app.use(session({
    'resave': true,
    'saveUninitialized': true,
    'secret': config.get('salt'),
    'store': new MongoStore({
        'host': config.get('mongodb.host'),
        'port': config.get('mongodb.port'),
        'db': config.get('mongodb.database'),
    }),
}));

app.set('port', config.get('server.port'));
app.use(logger('dev'));
app.use(methodOverride());

if (app.get('env') !== 'production') {
    app.use(errorHandler());
}




let database = new Database();

database.connect((err, db) => {
    if(err) {
        throw err;
    }

    let migrate = new Migrate(db, CONST);

    migrate.start()
    .then(() => {
        new Passport(app, db, config);
        new Api(app, db, CONST, packageJson);
    })
    .catch(err => { throw err; });
});









app.get('/theme-s8c2d4', (req, res) => {
    res.redirect('/t/s8c2d4-MapContrib');
});


let port = app.get('port');

app.listen(port, () => {
    console.log(`MapContrib ${packageJson.version} is up on the port ${port}`);
});

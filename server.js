
import path from 'path';

import ejs from 'ejs';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import methodOverride from 'method-override';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import httpsRedirect from 'express-https-redirect';
import errorHandler from 'errorhandler';
import connectMongo from 'connect-mongo';

import SERVER_CONST from './const';
import PUBLIC_CONST from './public/js/const';
import packageJson from './package.json';
import config from 'config';
import logger from './lib/logger';
// import throwError from './lib/throwError';
import Database from './lib/database';
// import Migrate from './lib/migrate';
import Api from './api';
import Passport from './lib/passport';


const CONST = { ...SERVER_CONST, ...PUBLIC_CONST };

if (!config.get('client.oauthConsumerKey')) {
    throw new Error('Error: client.oauthConsumerKey is not configured');
}

if (!config.get('client.oauthSecret')) {
    throw new Error('Error: client.oauthSecret is not configured');
}


const MongoStore = connectMongo(session);
const app = express();


if (config.get('forceHttps') === true) {
    app.use('/', httpsRedirect());
}


app.use(compression());
app.use(
    helmet({
        frameguard: false,
    })
);
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.get('salt'),
    store: new MongoStore({
        host: config.get('mongodb.host'),
        port: config.get('mongodb.port'),
        db: config.get('mongodb.database'),
    }),
}));

app.set('port', config.get('server.port'));
app.use(morgan('dev'));
app.use(methodOverride());

if (app.get('env') !== 'production') {
    app.use(errorHandler());
}


const database = new Database();
const passport = new Passport();
const api = new Api();

database.connect((err, db) => {
    if (err) {
        throw err;
    }

    // const migrate = new Migrate(db, CONST);
    //
    // migrate.start()
    // .then(() => {
        passport.init(app, db, config);
        api.init(app, db, CONST, packageJson);
    // })
    // .catch(throwError);
});


app.get('/theme-s8c2d4', (req, res) => {
    res.redirect('/t/s8c2d4-MapContrib');
});


const port = app.get('port');

app.listen(port, () => {
    logger.info(`MapContrib ${packageJson.version} is up on the port ${port}`);
});

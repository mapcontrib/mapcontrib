
import fs from 'fs';
import path from 'path';
import _ from 'underscore';

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

import CONST from './public/js/const';
import config from 'config';
import Database from './database';
import Api from './api';
import Passport from './passport';




let MongoStore = connectMongo(session);
let app = express();

app.use(compression());
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
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
app.use(multer({ 'dest': path.join(__dirname, 'upload') }));
app.use(serveStatic(path.join(__dirname, 'public')));

if (app.get('env') !== 'production') {
    app.use(errorHandler());
}




let database = new Database();

database.connect((err, db) => {
    if(err) throw err;

    new Passport(app, db, config);
    new Api(app, db, CONST);
});




let dataDirectory = path.join(__dirname, 'upload');

if ( !fs.existsSync( dataDirectory ) ) {
    fs.mkdirSync(dataDirectory);
}



app.get('/theme-s8c2d4', (req, res) => {
    res.redirect('/t/s8c2d4-MapContrib');
});


let port = app.get('port');

app.listen(port, () => {
    console.log(`MapContrib is up on the port ${port}`);
});


const secretKey = 'qsqodjcizeiufbvionkjqqsdfjhGJFJR76589964654jkhsdfskqdfglfser8754dgh4hjt54d89s6568765G+=)({}})';
const db = {
    'host': process.env.MONGO_HOST ? process.env.MONGO_HOST : 'localhost',
    'port': '27017',
    'name': 'mapcontrib'
};



import fs from 'fs';
import path from 'path';
import Api from './api';
import Passport from './passport';
import CONST from './public/js/const';
import settings from './public/js/settings';
import _ from 'underscore';




import MongoClient from 'mongodb';
import init from './init';

let mongoUrl = `mongodb://${db.host}:${db.port}/${db.name}`;

MongoClient.connect(mongoUrl, (err, db) => {
    if(err) throw err;

    init.setDatabase(db);

    init.isDone().catch(() => {
        init.start().catch((err) => {
            throw err;
        });
    });

    new Passport(app, db, settings);
    new Api(app, db, CONST);
});



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

let MongoStore = connectMongo(session);
let app = express();

app.use(compression());
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
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



let dataDirectory = path.join(__dirname, 'upload');

if ( !fs.existsSync( dataDirectory ) ) {
    fs.mkdirSync(dataDirectory);
}


app.get('/theme-s8c2d4', (req, res) => {
    res.redirect('/t/s8c2d4-MapContrib');
});




if (app.get('env') !== 'production') {
    app.use(errorHandler());
}

app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

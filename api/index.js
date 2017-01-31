
import fs from 'fs';
import { ObjectID } from 'mongodb';
import Backbone from 'backbone';
import config from 'config';
import logger from '../lib/logger';
import userApi from './user';
import themeApi from './theme';
import nonOsmDataApi from './nonOsmData';
import osmCacheApi from './osmCache';
import fileApi from './file';
import overPassCacheApi from './overPassCache';
import ThemeCore from '../public/js/core/theme';
import ThemeModel from '../public/js/model/theme';


export default class Api {
    init(app, db, CONST, packageJson) {
        this.options = {
            CONST,
            database: db,
            fileApi,
        };

        userApi.setOptions( this.options );
        themeApi.setOptions( this.options );
        nonOsmDataApi.setOptions( this.options );
        osmCacheApi.setOptions( this.options );
        fileApi.setOptions( this.options );
        fileApi.initDirectories( app );
        overPassCacheApi.setOptions( this.options );


        app.get('/api/user/logout', userApi.Api.logout);
        // app.get('/api/user', userApi.Api.getAll);
        app.get('/api/user/:_id', userApi.Api.get);
        app.post('/api/user', Api.isLoggedIn, userApi.Api.post);
        app.put('/api/user/:_id', Api.isLoggedIn, userApi.Api.put);
        // app.delete(
        //     '/api/user/:_id',
        //     Api.isLoggedIn,
        //     this._isThemeOwner.bind(this),
        //     userApi.Api.delete
        // );

        app.get('/api/userThemes', themeApi.Api.getUserThemes);

        app.get('/api/theme', themeApi.Api.getAll);
        app.get('/api/theme/:_id', themeApi.Api.get);
        app.post('/api/theme', Api.isLoggedIn, themeApi.Api.post);
        app.put('/api/theme/:_id', Api.isLoggedIn, this._isThemeOwner.bind(this), themeApi.Api.put);
        // app.delete(
        //     '/api/theme/:_id',
        //     Api.isLoggedIn,
        //     this._isThemeOwner.bind(this),
        //     themeApi.Api.delete
        // );

        app.get('/api/nonOsmData', nonOsmDataApi.Api.getAll);
        app.get('/api/nonOsmData/:_id', nonOsmDataApi.Api.get);
        app.post('/api/nonOsmData', Api.isLoggedIn, nonOsmDataApi.Api.post);
        app.put('/api/nonOsmData/:_id', Api.isLoggedIn, nonOsmDataApi.Api.put);

        app.get('/api/osmCache', osmCacheApi.Api.getAll);
        app.get('/api/osmCache/:_id', osmCacheApi.Api.get);
        app.post('/api/osmCache', Api.isLoggedIn, osmCacheApi.Api.post);
        app.put('/api/osmCache/:_id', Api.isLoggedIn, osmCacheApi.Api.put);
        app.delete('/api/osmCache/:_id', osmCacheApi.Api.delete);


        app.get('/', (req, res) => {
            const clientConfig = config.get('client');
            const templateVars = {
                user: req.session.user ? escape(JSON.stringify(req.session.user)) : '{}',
                config: JSON.stringify( clientConfig ),
                highlightList: '[]',
                version: packageJson.version,
                analyticScript: config.get('analyticScript'),
            };

            const promises = [
                themeApi.Api.findFromUserSession(req.session.user),
                themeApi.Api.findFavoritesFromUserSession(req.session.user),
                Api.reloadSession(req),
            ];

            const highlightPromises = [];

            if (clientConfig.highlightedThemes && clientConfig.highlightedThemes.length > 0) {
                for (const fragment of clientConfig.highlightedThemes) {
                    highlightPromises.push(
                        themeApi.Api.findFromFragment(fragment)
                    );
                }
            }

            Promise.all(promises)
            .then((data) => {
                templateVars.userThemes = escape(JSON.stringify( data[0] ));
                templateVars.userFavoriteThemesData = escape(JSON.stringify( data[1] ));

                return Promise.all(highlightPromises);
            })
            .then((data) => {
                if (data.length > 0) {
                    const highlightList = [];

                    for (const themeObject of data) {
                        highlightList.push(themeObject);
                    }

                    templateVars.highlightList = escape(JSON.stringify( highlightList ));
                }

                res.render('home', templateVars);
            })
            .catch( Api.onPromiseError.bind(this, res) );
        });

        app.get(/\/t\/(\w+)(-.*)?/, (req, res) => {
            const fragment = req.params['0'];
            const templateVars = {
                user: req.session.user ? escape(JSON.stringify(req.session.user)) : '{}',
                config: JSON.stringify( config.get('client') ),
                version: packageJson.version,
                analyticScript: config.get('analyticScript'),
            };

            const promises = [
                themeApi.Api.findFromFragment(fragment),
                themeApi.Api.findFromUserSession(req.session.user),
                themeApi.Api.findFavoritesFromUserSession(req.session.user),
                nonOsmDataApi.Api.findFromFragment(fragment),
                osmCacheApi.Api.findFromFragment(fragment),
                Api.getiDPresets(CONST),
                Api.reloadSession(req),
            ];

            Promise.all( promises )
            .then((data) => {
                templateVars.theme = escape(JSON.stringify( data[0] ));
                templateVars.themeAnalyticScript = data[0].analyticScript;
                templateVars.userThemes = escape(JSON.stringify( data[1] ));
                templateVars.userFavoriteThemesData = escape(JSON.stringify( data[2] ));
                templateVars.nonOsmData = escape(JSON.stringify( data[3] ));
                templateVars.osmCache = escape(JSON.stringify( data[4] ));
                templateVars.iDPresets = escape(JSON.stringify( data[5] ));

                res.render('theme', templateVars);
            })
            .catch( Api.onPromiseError.bind(this, res) );
        });


        app.get('/create_theme', Api.isLoggedIn, (req, res) => {
            const userId = req.session.user._id.toString();

            themeApi.Api.createTheme(req.session, userId)
            .then((theme) => {
                Backbone.Relational.store.reset();

                const model = new ThemeModel(theme);

                res.redirect(
                    ThemeCore.buildPath(
                        model.get('fragment'),
                        model.get('name')
                    )
                );
            })
            .catch( Api.onPromiseError.bind(this, res) );
        });

        app.get('/delete_theme/:fragment', Api.isLoggedIn, this._isThemeOwner.bind(this), themeApi.Api.deleteFromFragment);


        app.post('/api/file/shape', fileApi.Api.postShapeFile);
        app.post('/api/file/nonOsmData', fileApi.Api.postNonOsmDataFile);

        app.get('/api/overPassCache/generate/:uuid', Api.isLoggedIn, overPassCacheApi.Api.generate);
        app.get('/api/iDPresets/locale', (req, res) => {
            if (!req.query.locales || req.query.locales.length < 1) {
                return res.sendStatus(400);
            }

            for (const locale of req.query.locales) {
                const localeFile = `${CONST.iDLocalesDirectoryPath}/${locale}.json`;

                try {
                    fs.statSync(localeFile);
                    return res.send(
                        fs.readFileSync(localeFile, 'utf-8')
                    );
                }
                catch (e) {
                    logger.error(e);
                }
            }

            return res.sendStatus(404);
        });
    }

    static isLoggedIn(req, res, next) {
        if ( req.isAuthenticated() ) {
            return next();
        }

        return res.sendStatus(401);
    }

    _isThemeOwner(req, res, next) {
        const question = {};

        if (req.params._id) {
            question._id = new ObjectID(req.params._id);

            if ( !this.options.CONST.pattern.mongoId.test( req.params._id ) ) {
                res.sendStatus(400);
                return;
            }
        }

        if (req.params.fragment) {
            question.fragment = req.params.fragment;

            if ( !this.options.CONST.pattern.fragment.test( req.params.fragment ) ) {
                res.sendStatus(400);
                return;
            }
        }

        const collection = this.options.database.collection('theme');

        collection.find( question )
        .toArray((err, results) => {
            if (err) {
                logger.error(err);
                return res.sendStatus(500);
            }

            if (results.length === 0) {
                return res.sendStatus(404);
            }

            const theme = results[0];
            const userId = req.session.user._id.toString();

            if ( theme.owners.indexOf(userId) !== -1 ) {
                return next();
            }

            if ( theme.owners.indexOf('*') !== -1 ) {
                return next();
            }

            return res.sendStatus(401);
        });
    }

    static reloadSession(req) {
        return new Promise((resolve) => {
            req.session.reload(() => {
                resolve();
            });
        });
    }


    static onPromiseError(res, errorCode) {
        res.sendStatus(errorCode);
    }


    static getiDPresets(CONST) {
        return new Promise((resolve, reject) => {
            fs.readFile(CONST.iDPresetsPath, 'utf-8', (err, data) => {
                if (err) {
                    logger.error(err);
                    return reject(err);
                }

                return resolve(JSON.parse(data));
            });
        });
    }
}


import 'babel-polyfill';
import './tools';
import 'jquery-form';
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import '../lib/l20n.min.js';
import SmoothScrollPolyfill from 'smoothscroll-polyfill';

import 'ionicons/css/ionicons.css';
import 'font-awesome-webpack';
import 'bootstrap-webpack';
import 'awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css';
import 'bootstrap-filestyle';
import 'bootstrap-more/bootstrap-more.css';
import 'bootstrap-more/bootstrap-more.js';
import 'leaflet/dist/leaflet.css';

import CONST from 'const';
import GlobalRouter from 'router/global';
import UserModel from 'model/user';
import UserThemeCollection from 'collection/userTheme';
import UserFavoriteThemes from 'core/userFavoriteThemes';
import UserFavoriteThemesDataCollection from 'collection/userFavoriteThemesData';
import ThemeModel from 'model/theme';
import NonOsmDataCollection from 'collection/nonOsmData';
import OsmCacheCollection from 'collection/osmCache';
import LayerCollection from 'collection/layer';
import Behaviors from './behavior';
import IDPresetsHelper from 'helper/iDPresets';


export default Marionette.Application.extend({
    regions: {
        root: '#rg_root',
    },

    initialize(window) {
        window.document.l10n.addEventListener('error', (err) => {
            console.error(`L20n: ${err}`);
        });

        window.document.l10n.addEventListener('warning', (err) => {
            console.warn(`L20n: ${err}`);
        });

        SmoothScrollPolyfill.polyfill();


        this._radio = Wreqr.radio.channel('global');

        this._radio.vent.on('session:logged', () => {
            this._isLogged = true;
            window.document.body.classList.add('user_logged');
        });

        this._radio.vent.on('session:unlogged', () => {
            this._isLogged = false;
            window.document.body.classList.remove('user_logged');
            this._user = new UserModel();
        });


        Marionette.Behaviors.behaviorsLookup = Behaviors;

        this._isLogged = false;
        this._isThemePage = false;
        this._isHomePage = false;
        this._window = window;
        this._tempLayerCollection = new LayerCollection();

        if (window.MAPCONTRIB) {
            this._config = MAPCONTRIB.config;
            this._version = MAPCONTRIB.version;
            this._user = new UserModel(
                JSON.parse(unescape( MAPCONTRIB.user ))
            );

            this._tiles = {
                ...CONST.map.tiles,
                ...this._config.customTiles,
            };

            if (MAPCONTRIB.user) {
                this._user = new UserModel(
                    JSON.parse(unescape( MAPCONTRIB.user ))
                );
            }

            if (MAPCONTRIB.userThemes) {
                this._userThemes = new UserThemeCollection(
                    JSON.parse(unescape( MAPCONTRIB.userThemes ))
                );
            }

            if (MAPCONTRIB.userFavoriteThemesData) {
                this._userFavoriteThemes = new UserFavoriteThemes(
                    this._user,
                    new UserFavoriteThemesDataCollection(
                        JSON.parse(unescape( MAPCONTRIB.userFavoriteThemesData ))
                    )
                );
            }

            if (MAPCONTRIB.theme) {
                this._theme = new ThemeModel(
                    JSON.parse(unescape( MAPCONTRIB.theme ))
                );
            }

            if (MAPCONTRIB.nonOsmData) {
                this._nonOsmData = new NonOsmDataCollection(
                    JSON.parse(unescape( MAPCONTRIB.nonOsmData ))
                );
            }

            if (MAPCONTRIB.osmCache) {
                this._osmCache = new OsmCacheCollection(
                    JSON.parse(unescape( MAPCONTRIB.osmCache ))
                );
            }

            if (MAPCONTRIB.iDPresets) {
                this._iDPresetsHelper = new IDPresetsHelper(
                    JSON.parse(unescape( MAPCONTRIB.iDPresets ))
                );

                $.get({
                    async: false,
                    url: `${CONST.apiPath}/iDPresets/locale`,
                    data: { locales: document.l10n.supportedLocales },
                    success: this.onReceiveIDPresetsLocale.bind(this),
                });
            }
        }

        const bodyClasses = window.document.body.className.split(' ');
        if (bodyClasses.indexOf('page_home') > -1) {
            this._isHomePage = true;
        }
        else if (bodyClasses.indexOf('page_theme') > -1) {
            this._isThemePage = true;
        }
    },

    getWindow() {
        return this._window;
    },

    getDocument() {
        return this._window.document;
    },

    getRouter() {
        return this._router;
    },

    getUser() {
        return this._user;
    },

    getUserThemes() {
        return this._userThemes;
    },

    getUserFavoriteThemes() {
        return this._userFavoriteThemes;
    },

    getConfig() {
        return this._config;
    },

    getVersion() {
        return this._version;
    },

    getTheme() {
        return this._theme;
    },

    getTiles() {
        return this._tiles;
    },

    getTempLayerCollection() {
        return this._tempLayerCollection;
    },

    getNonOsmData() {
        return this._nonOsmData;
    },

    getOsmCache() {
        return this._osmCache;
    },

    getIDPresetsHelper() {
        return this._iDPresetsHelper;
    },

    isLogged() {
        return this._isLogged;
    },

    isThemePage() {
        return this._isThemePage;
    },

    isHomePage() {
        return this._isHomePage;
    },

    onStart(options) {
        const Router = options.router;
        const RootView = options.rootView;

        if ( this._user && this._user.get('_id') ) {
            this._radio.vent.trigger('session:logged');
        }

        this._globalRouter = new GlobalRouter(this);

        if (Router) {
            this._router = new Router(this);
            this._radio.reqres.setHandler('router', () => this._router);
        }

        Backbone.history.start();

        this.getRegion('root').show(
            new RootView({ app: this })
        );
    },

    onReceiveIDPresetsLocale(response) {
        this._iDPresetsHelper.setLocaleStrings(
            JSON.parse(response)
        );

        this._radio.vent.trigger('iDPresets:loaded');
    },
});

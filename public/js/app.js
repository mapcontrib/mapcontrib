
import 'babel-polyfill';
import './tools';
import 'jquery-form';
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import '../lib/l20n.min.js';

import 'ionicons/css/ionicons.css';
import 'font-awesome-webpack';
import 'bootstrap-webpack';
import 'awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css';
import 'bootstrap-filestyle';
import 'bootstrap-more/bootstrap-more.css';
import 'bootstrap-more/bootstrap-more.js';
import 'leaflet/dist/leaflet.css';

import CONST from 'const';
import UserModel from './model/user';
import ThemeModel from './model/theme';
import NonOsmDataCollection from './collection/nonOsmData';
import OsmCacheCollection from './collection/osmCache';
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
        this._window = window;
        this._config = MAPCONTRIB.config;
        this._version = MAPCONTRIB.version;
        this._user = new UserModel(
            JSON.parse(unescape( MAPCONTRIB.user ))
        );

        if (MAPCONTRIB.user) {
            this._user = new UserModel(
                JSON.parse(unescape( MAPCONTRIB.user ))
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
    },

    getWindow() {
        return this._window;
    },

    getDocument() {
        return this._window.document;
    },

    getUser() {
        return this._user;
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

    onStart(Router) {
        if ( this._user.get('_id') ) {
            this._radio.vent.trigger('session:logged');
        }

        this._router = new Router(this);

        this._radio.reqres.setHandler('router', () => this._router);

        Backbone.history.start();
    },

    onReceiveIDPresetsLocale(response) {
        this._iDPresetsHelper.setLocaleStrings(
            JSON.parse(response)
        );

        this._radio.vent.trigger('iDPresets:loaded');
    },
});

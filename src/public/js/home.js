
import 'babel-polyfill';
import tools from './tools';
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import L20n from '../lib/l20n.min.js';

import ionicons from 'ionicons/css/ionicons.css';
import fontAwesome from 'font-awesome-webpack';
import bootstrap from 'bootstrap-webpack';
import awesomeBootstrapCheckbox from 'awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css';
import bootstrapMoreCss from 'bootstrap-more/bootstrap-more.css';
import bootstrapMoreJs from 'bootstrap-more/bootstrap-more.js';
import leafletCss from 'leaflet/dist/leaflet.css';

import appStyle from '../css/app.less';

import Router from './router';
import UserModel from './model/user';
import L20nBehavior from './behavior/l20n';
import ColumnBehavior from './behavior/column';
import ModalBehavior from './behavior/modal';
import NotificationBehavior from './behavior/notification';
import WidgetBehavior from './behavior/widget';



var App = Marionette.Application.extend({

    _var: {

        isLogged: false,
    },
    _region: {},
    _behavior: {},
    _view: {},
    _model: {},
    _modelCalcul: {},
    _collection: {},

    regions: {

        'root': '#rg_root',
    },

    initialize: function(options) {

        document.l10n.addEventListener('error', (err) => {

            console.error(err);
        });
        document.l10n.addEventListener('warning', (err) => {

            console.warn(err);
        });

        Marionette.Behaviors.behaviorsLookup = () => {

            return {

                'l20n': L20nBehavior,
                'column': ColumnBehavior,
                'modal': ModalBehavior,
                'notification': NotificationBehavior,
                'widget': WidgetBehavior,
            };
        };


        this._model = {

            'user': new UserModel( window.user ),
        };


        this._radio = Wreqr.radio.channel('global');

        this._radio.vent.on('session:logged', () => {

            this._var.isLogged = true;

            document.body.classList.add('user_logged');
        });

        this._radio.vent.on('session:unlogged', () => {

            this._var.isLogged = false;

            document.body.classList.remove('user_logged');

            this._model.user = new UserModel();
        });


        this._radio.reqres.setHandlers({

            'model': (name) => {

                return this._model[name];
            },
            'collection': (name) => {

                return this._collection[name];
            },
            'view': (name) => {

                return this._view[name];
            },
            'region': (name) => {

                return this._region[name];
            },
            'var': (name) => {

                return this._var[name];
            },
        });


        this._radio.commands.setHandlers({

            'app:registerBehavior': (name, behavior) => {

                this._behavior[name] = behavior;
            },
            'app:registerView': (name, view) => {

                this._view[name] = view;
            },
            'app:registerRegion': (name, region) => {

                this._region[name] = region;
            },
        });

        this._radio.commands.execute('app:registerRegion', 'root', this.getRegion('root'));
    },

    onStart: function (options) {

        if ( this._model.user.get('_id') ) {

            this._radio.vent.trigger('session:logged');
        }

        this._router = new Router();

        this._radio.reqres.setHandler('router', () => { return this._router; });

        Backbone.history.start();
    },

    onExecuteRegisterView: function (name, view) {

        this._view[name] = view;
    },
});


// document.l10n.ready( function () {
//
//     new App().start();
// });

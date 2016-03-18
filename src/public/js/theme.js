
'use strict';


var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var tools = require('./tools');
var L20n = require('l20n');
var Router = require('./router');
var UserModel = require('./model/user');
var L20nBehavior = require('./behavior/l20n');
var ColumnBehavior = require('./behavior/column');
var ModalBehavior = require('./behavior/modal');
var NotificationBehavior = require('./behavior/notification');
var WidgetBehavior = require('./behavior/widget');



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

        var self = this;

        document.l10n.addEventListener('error', function (err) {

            console.error(err);
        });
        document.l10n.addEventListener('warning', function (err) {

            console.warn(err);
        });

        Marionette.Behaviors.behaviorsLookup = function() {

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


        this._radio = Backbone.Wreqr.radio.channel('global');

        this._radio.vent.on('session:logged', function (){

            self._var.isLogged = true;

            $('body').addClass('user_logged');
        });

        this._radio.vent.on('session:unlogged', function (){

            self._var.isLogged = false;

            $('body').removeClass('user_logged');

            self._model.user = new UserModel();
        });


        this._radio.reqres.setHandlers({

            'model': function (name) {

                return self._model[name];
            },
            'collection': function (name) {

                return self._collection[name];
            },
            'view': function (name) {

                return self._view[name];
            },
            'region': function (name) {

                return self._region[name];
            },
            'var': function (name) {

                return self._var[name];
            },
        });


        this._radio.commands.setHandlers({

            'app:registerBehavior': function (name, behavior) {

                self._behavior[name] = behavior;
            },
            'app:registerView': function (name, view) {

                self._view[name] = view;
            },
            'app:registerRegion': function (name, region) {

                self._region[name] = region;
            },
        });

        this._radio.commands.execute('app:registerRegion', 'root', this.getRegion('root'));
    },

    onStart: function (options) {

        var self = this;

        if ( this._model.user.get('_id') ) {

            this._radio.vent.trigger('session:logged');
        }

        this._router = new Router();

        this._radio.reqres.setHandler('router', function () { return self._router; });

        Backbone.history.start();
    },

    onExecuteRegisterView: function (name, view) {

        this._view[name] = view;
    },
});


document.l10n.ready( function () {

    new App().start();
});

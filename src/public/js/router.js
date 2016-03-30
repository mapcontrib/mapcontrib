
import $ from 'jquery';
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import settings from './settings';
import MainView from './view/main';


export default Backbone.Router.extend({

    routes: {

        '': 'routeDefault',
        'oups': 'routeDefault',

        'logout': 'routeLogout',
    },


    initialize: function () {

        this._currentScreen = null;
        this._radio = Wreqr.radio.channel('global');

        this._user = this._radio.reqres.request('model', 'user');
    },

    showScreen: function (View, options){

        var currentScreen = this._currentScreen;

        if (currentScreen) {

            $('html, body').scrollTop(0);
        }

        var viewInstance = new View( options );
        this._radio.reqres.request('region', 'root').show( viewInstance );

        this._currentScreen = viewInstance;
    },

    routeDefault: function (){

        this.showScreen( MainView );
    },

    routeLogout: function (){

        $.ajax({

            type: 'GET',
            url: settings.apiPath +'user/logout',
            dataType: 'json',
            context: this,
            complete: function () {

                this.navigate('');

                this._radio.vent.trigger('session:unlogged');
            }
        });
    },
});

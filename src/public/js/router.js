

define([

	'jquery',
	'underscore',
	'backbone',
	'settings',

	'view/main',
],
function (

	$,
	_,
	Backbone,
	settings,

	mainView
) {

	'use strict';


	return Backbone.Router.extend({

		routes: {

			'': 'routeDefault',
		},


		initialize: function () {

			var self = this;

			this._currentScreen = null;
			this._radio = Backbone.Wreqr.radio.channel('global');

			// this._user = this._radio.reqres.request('model', 'user');
		},

		showScreen: function (view, options){

			var self = this,
			currentScreen = this._currentScreen;


			if (currentScreen) {

				$('html, body').scrollTop(0);
			}


			var viewInstance = new view( options );
			this._radio.reqres.request('region', 'root').show( viewInstance );

			this._currentScreen = viewInstance;
		},

		routeDefault: function (){

			this.showScreen( mainView );
		},
	});
});

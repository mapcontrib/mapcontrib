

require(['config'], function (config) {

	require([

		'underscore',
		'backbone',
		'marionette',
		'animationFrame',
		'templates',
		'router',

		'behavior/column',
		'behavior/modal',
	],
	function (

		_,
		Backbone,
		Marionette,
		animationFrame,
		templates,
		Router,

		columnBehavior,
		modalBehavior
	) {

		'use strict';

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

				// requestAnimationFrame polyfill
				animationFrame.shim();

				Marionette.Behaviors.behaviorsLookup = function() {

					return {

						'column': columnBehavior,
						'modal': modalBehavior,
					};
				};


				// this._model = {
				//
				// 	'user': new UserModel(),
				// };


				this._radio = Backbone.Wreqr.radio.channel('global');
				this._radio.vent.on('session:logged', function (){ self._var.isLogged = true; });
				this._radio.vent.on('session:unlogged', function (){ self._var.isLogged = false; });


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

					'initObjects': function () { self.initObjects(); },
					'loadData': function () { self.loadData(); },
					'registerBehavior': function (name, behavior) {

						self._behavior[name] = behavior;
					},
					'registerView': function (name, view) {

						self._view[name] = view;
					},
					'registerRegion': function (name, region) {

						self._region[name] = region;
					},
				});

				this._radio.commands.execute('registerRegion', 'root', this.getRegion('root'));
			},

			onStart: function (options) {

				var self = this;

				this.initObjects();

				// this._model.user.set('_id', 'me');
				//
				// this._model.user.fetch({
				//
				// 	success: function (model) {
				//
				// 		if (!model.get('error')) {
				//
				// 			self._radio.vent.trigger('session:logged');
				//
				// 			self.loadData();
				// 		}
				//
				// 		self.launch();
				// 	},
				// 	error: function () {
				//
				// 		self.launch();
				// 	}
				// });

				this.launch();
			},

			initObjects: function () {

				var self = this;

				// this._collection.stuff = new StuffCollection();
			},


			loadData: function () {

				var self = this;

				// this._collection.stuff.fetch();
			},

			launch: function () {

				var self = this;

				this._router = new Router();

				this._radio.reqres.setHandler('router', function () { return self._router; });

				Backbone.history.start();
			},

			onExecuteRegisterView: function (name, view) {

				this._view[name] = view;
			},
		});


		new App().start();
	});
});

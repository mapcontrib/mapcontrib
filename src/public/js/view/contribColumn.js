

define([

	'underscore',
	'backbone',
	'marionette',
	'bootstrap',
	'templates',
],
function (

	_,
	Backbone,
	Marionette,
	Bootstrap,
	templates
) {

	'use strict';

	return Marionette.LayoutView.extend({

		template: JST['contribColumn.html'],

		behaviors: {

			'l20n': {},
			'column': {},
		},

		ui: {

			'column': '#contrib_column',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');
		},

		open: function (latLng) {

			this._radio.vent.trigger('column:closeAll');
			this._radio.vent.trigger('widget:closeAll');

			console.log(latLng);

			this.triggerMethod('open');
		},

		close: function () {

			this.triggerMethod('close');
		},
	});
});

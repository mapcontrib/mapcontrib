

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

		template: JST['poiColumn.html'],

		behaviors: {

			'l20n': {},
			'column': {},
		},

		ui: {

			'column': '#poi_column',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');
		},

		open: function () {

			this._radio.vent.trigger('column:closeAll');

			this.triggerMethod('open');
		},

		close: function () {

			this.triggerMethod('close');
		},
	});
});

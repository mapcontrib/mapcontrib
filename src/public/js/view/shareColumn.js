

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

		template: JST['shareColumn.html'],

		behaviors: {

			'column': {},
		},

		ui: {

			'column': '#share_column',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');
		},

		open: function () {

			this.triggerMethod('open');
		},

		close: function () {

			this.triggerMethod('close');
		},
	});
});

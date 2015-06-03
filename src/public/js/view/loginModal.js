

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

		template: JST['loginModal.html'],

		behaviors: {

			'l20n': {},
			'modal': {},
		},

		ui: {

			'modal': '#login_modal',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');

			this._radio.vent.trigger('column:closeAll');
		},

		close: function () {

			this.triggerMethod('close');
		},
	});
});

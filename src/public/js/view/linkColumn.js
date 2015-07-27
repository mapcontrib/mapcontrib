

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

		template: JST['linkColumn.html'],

		behaviors: {

			'l20n': {},
			'column': {},
		},

		ui: {

			'column': '#link_column',
		},

		events: {

			'click input, textarea': 'onClickInputs',
		},

		templateHelpers: function () {

			var url = window.location.protocol +'//'+ window.location.host +'/theme-'+ this.model.get('fragment');

			return {

				'url': url,
			};
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

		onClickInputs: function (e) {

			e.target.select();
		},
	});
});

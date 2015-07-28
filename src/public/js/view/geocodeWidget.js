

define([

	'underscore',
	'backbone',
	'marionette',
	'bootstrap',
	'templates',
	'settings',
],
function (

	_,
	Backbone,
	Marionette,
	Bootstrap,
	templates,
	settings
) {

	'use strict';

	return Marionette.LayoutView.extend({

		template: JST['geocodeWidget.html'],

		behaviors: {

			'l20n': {},
			'widget': {},
		},

		ui: {

			'widget': '#geocode_widget',
			'query': 'input',
		},

		events: {

			'change @ui.query': 'onChangeQuery',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');

			this._isOpened = false;
		},

		open: function () {

			var self = this;

			this._radio.vent.trigger('column:closeAll');

			this.ui.widget.one('transitionend', function () {

				self.ui.query.focus();
			});

			this._isOpened = true;

			this.triggerMethod('open');
		},

		close: function () {

			this._isOpened = false;

			this.triggerMethod('close');
		},

		isOpened: function () {

			return this._isOpened;
		},

		onChangeQuery: function (e) {

		},
	});
});

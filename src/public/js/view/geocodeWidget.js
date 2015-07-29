

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
			'blur @ui.query': 'close',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');

			this.on('open', this.onOpen);
		},

		open: function () {

			this.triggerMethod('open');
		},

		close: function () {

			this.triggerMethod('close');
		},

		toggle: function () {

			this.triggerMethod('toggle');
		},

		onOpen: function () {

			var self = this;

			this._radio.vent.trigger('column:closeAll');

			this.ui.widget.one('transitionend', function () {

				self.ui.query.focus();
			});
		},

		onChangeQuery: function (e) {

		},
	});
});

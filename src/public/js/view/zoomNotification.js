

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

		template: JST['zoomNotification.html'],

		behavior: {

			'l20n': {},
		},

		ui: {

			'window': '#zoom_notification',

			'closeBtn': '.close_btn',
			'content': '.content',
		},

		events: {

			'click @ui.closeBtn': 'onClickClose',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');
		},

		open: function () {

			this.ui.window.addClass('open');
		},

		close: function () {

			this.ui.window.removeClass('open');
		},

		onClickClose: function () {

			this.close();
		},
	});
});

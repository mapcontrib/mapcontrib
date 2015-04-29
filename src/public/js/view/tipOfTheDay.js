

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

		template: JST['tipOfTheDay.html'],

		ui: {

			'window': '#tip_of_the_day',
			'okBtn': '.ok_btn',
			'closeBtn': '.close_btn',
		},

		events: {

			'click @ui.okBtn': 'onClickOk',
			'click @ui.closeBtn': 'onClickClose',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');
		},

		onClickOk: function () {

			this.ui.window.removeClass('open');
		},

		onClickClose: function () {

			this.ui.window.removeClass('open');
		},
	});
});



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

		behavior: {

			'l20n': {},
		},

		ui: {

			'window': '#tip_of_the_day',
			'okBtn': '.ok_btn',
			'closeBtn': '.close_btn',
			'content': '.content',
		},

		events: {

			'click @ui.okBtn': 'onClickOk',
			'click @ui.closeBtn': 'onClickClose',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');
		},

		onRender: function () {

			this.ui.content
			.html('<a href="https://openstreetmap.org" target="_blank"></a>')
			.attr('data-l10n-id', 'tip1');
		},

		onClickOk: function () {

			this.ui.window.removeClass('open');
		},

		onClickClose: function () {

			this.ui.window.removeClass('open');
		},
	});
});

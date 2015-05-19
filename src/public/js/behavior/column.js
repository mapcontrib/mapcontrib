

define([

	'underscore',
	'backbone',
	'marionette',
],
function (

	_,
	Backbone,
	Marionette
) {

	'use strict';

	return Marionette.Behavior.extend({

		ui: {

			'closeBtn': '.close_btn',
		},

		events: {

			'click @ui.closeBtn': 'onClickClose',
		},

		onOpen: function () {

			this.ui.column.addClass('open');
		},

		onClose: function () {

			this.ui.column.removeClass('open');
		},

		onClickClose: function () {

			this.onClose();
		},
	});
});

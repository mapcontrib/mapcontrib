

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

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');

			this.listenTo(this._radio.vent, 'column:closeAll', this.onClose);
		},

		onDestroy: function () {

			this.stopListening(this._radio.vent, 'column:closeAll');
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

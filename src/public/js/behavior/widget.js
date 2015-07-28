

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

		defaults: {

			'destroyOnClose': false,
		},

		ui: {

			'closeBtn': '.close_btn',
		},

		events: {

			'click @ui.closeBtn': 'onClickClose',
		},

		initialize: function (options) {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');

			this.listenTo(this._radio.vent, 'widget:closeAll', this.onClose);
		},

		onDestroy: function () {

			this.stopListening(this._radio.vent, 'widget:closeAll');
		},

		onOpen: function () {

			this.ui.widget.addClass('open');
		},

		onClose: function () {

			var self = this;

			this.ui.widget.on('transitionend', function () {

				if ( self.options.destroyOnClose ) {

					self.view.destroy();
				}
			})
			.removeClass('open');
		},

		onClickClose: function () {

			this.onClose();
		},
	});
});

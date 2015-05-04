

define([

	'underscore',
	'backbone',
	'marionette',
	'bootstrap',
],
function (

	_,
	Backbone,
	Marionette,
	Bootstrap,
	templates
) {

	'use strict';

	return Marionette.Behavior.extend({

		ui: {

			'closeBtn': '.close_btn',
		},

		events: {

			'click @ui.modal': 'onClickModal',
			'click @ui.closeBtn': 'onClickClose',
		},

		onShow: function () {

			var self = this;

			setTimeout(function () {

				window.requestAnimationFrame(function () {

					self.ui.modal.addClass('open');
				});
			}, 100);
		},

		onClose: function () {

			var self = this;

			this.ui.modal.on('transitionend', function () {

				self.view.destroy();
			})
			.removeClass('open');
		},

		onClickModal: function (e) {

			if (e.target !== this.ui.modal[0]) {

				return;
			}

			this.onClose();
		},

		onClickClose: function () {

			this.onClose();
		},
	});
});

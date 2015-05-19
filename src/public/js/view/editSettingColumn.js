

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

	return Marionette.ItemView.extend({

		template: JST['editSettingColumn.html'],

		behaviors: {

			'l20n': {},
			'column': {},
		},

		ui: {

			'column': '#edit_setting_column',

			'profileName': '#profile_name',
			'profilePositionKeepOld': '#profile_position_keep_old',
			'profilePositionSetNew': '#profile_position_set_new',
		},

		events: {

			'submit': 'onSubmit',
			'reset': 'onReset',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');
		},

		open: function () {

			this.triggerMethod('open');
		},

		close: function () {

			this.triggerMethod('close');
		},

		onSubmit: function (e) {

			e.preventDefault();

			var self = this,
			map = this._radio.reqres.request('map'),
			mapCenter = map.getCenter(),
			mapZoomLevel = map.getZoom();

			this.model.set('name', this.ui.profileName.val());

			if ( this.ui.profilePositionSetNew.prop('checked') === true ) {

				this.model.set('center', mapCenter);
				this.model.set('zoomLevel', mapZoomLevel);
			}

			this.model.save({}, {

				'success': function () {

					self.close();
				},
				'error': function () {

					// FIXME
					console.error('nok');
				},
			});
		},

		onReset: function () {

			this.close();
		},
	});
});

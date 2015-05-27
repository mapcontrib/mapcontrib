

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
			'profileDescription': '#profile_description',
			'colorButtons': '.colorButtons .btn',
			'profilePositionKeepOld': '#profile_position_keep_old',
			'profilePositionSetNew': '#profile_position_set_new',
		},

		events: {

			'mouseover @ui.colorButtons': 'onOverColorButtons',
			'mouseleave @ui.colorButtons': 'onLeaveColorButtons',
			'click @ui.colorButtons': 'onClickColorButtons',

			'submit': 'onSubmit',
			'reset': 'onReset',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');

			this._oldModel = this.model.clone();
		},

		onRender: function () {

			this.ui.colorButtons
			.filter( '.'+ this.model.get('color') )
			.find('i')
			.addClass('fa-check');
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
			this.model.set('description', this.ui.profileDescription.val());

			if ( this.ui.profilePositionSetNew.prop('checked') === true ) {

				this.model.set('center', mapCenter);
				this.model.set('zoomLevel', mapZoomLevel);
			}

			this.model.save({}, {

				'success': function () {

					self._oldModel = self.model.clone();

					self.close();
				},
				'error': function () {

					// FIXME
					console.error('nok');
				},
			});
		},

		onReset: function () {

			this.model.set( this._oldModel.toJSON() );

			this._radio.commands.execute('setTitleColor', this.model.get('color'));

			this.ui.column.one('transitionend', this.render);

			this.close();
		},

		onOverColorButtons: function (e) {

			this._radio.commands.execute('setTitleColor', e.target.dataset.color);
		},

		onLeaveColorButtons: function (e) {

			this._radio.commands.execute('setTitleColor', this.model.get('color'));
		},

		onClickColorButtons: function (e) {

			$('i', this.ui.colorButtons).removeClass('fa-check');

			e.target.querySelector('i').classList.add('fa-check');

			this.model.set('color', e.target.dataset.color);
		},
	});
});

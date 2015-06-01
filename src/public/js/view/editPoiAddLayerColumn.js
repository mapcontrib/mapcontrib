

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

		template: JST['editPoiAddLayerColumn.html'],

		behaviors: {

			'l20n': {},
			'column': {},
		},

		ui: {

			'column': '#edit_poi_add_layer_column',

			'layerName': '#layer_name',
		},

		events: {

			'submit': 'onSubmit',
			'reset': 'onReset',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');

			this._oldModel = this.model.clone();
		},

		open: function () {

			this.triggerMethod('open');
		},

		close: function () {

			this.triggerMethod('close');
		},

		onSubmit: function (e) {

			e.preventDefault();

			// var self = this,
			// map = this._radio.reqres.request('map'),
			// mapCenter = map.getCenter(),
			// mapZoomLevel = map.getZoom();
			//
			// this.model.set('name', this.ui.profileName.val());
			// this.model.set('description', this.ui.profileDescription.val());
			//
			// if ( this.ui.profilePositionSetNew.prop('checked') === true ) {
			//
			// 	this.model.set('center', mapCenter);
			// 	this.model.set('zoomLevel', mapZoomLevel);
			// }
			//
			// this.model.save({}, {
			//
			// 	'success': function () {
			//
			// 		self._oldModel = self.model.clone();
			//
			// 		self.close();
			// 	},
			// 	'error': function () {
			//
			// 		// FIXME
			// 		console.error('nok');
			// 	},
			// });
		},

		onReset: function () {

			this.model.set( this._oldModel.toJSON() );

			this.ui.column.one('transitionend', this.render);

			this.close();
		},
	});
});

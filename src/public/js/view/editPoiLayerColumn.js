

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

		template: JST['editPoiLayerColumn.html'],

		behaviors: {

			'l20n': {},
			'column': {},
		},

		ui: {

			'column': '#edit_poi_layer_column',

			'layerName': '#layer_name',
			'layerDescription': '#layer_description',
			'layerOverpassRequest': '#layer_overpass_request',
			'layerPopupContent': '#layer_popup_content',
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

			var self = this;

			this.model.set('name', this.ui.layerName.val());
			this.model.set('description', this.ui.layerDescription.val());
			this.model.set('overpassRequest', this.ui.layerOverpassRequest.val());
			this.model.set('popupContent', this.ui.layerPopupContent.val());

			if ( !this.model.get('_id') ) {

				this._radio.reqres.request('poiLayers').add( this.model );
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

			this.ui.column.one('transitionend', this.render);

			this.close();
		},
	});
});



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
			'column': {

				'destroyOnClose': true,
			},
		},

		ui: {

			'column': '#edit_poi_layer_column',

			'layerName': '#layer_name',
			'layerDescription': '#layer_description',
			'layerDataEditable': '#layer_data_editable',
			'layerOverpassRequest': '#layer_overpass_request',
			'layerPopupContent': '#layer_popup_content',

			'markerWrapper': '.marker-wrapper',
			'editMarkerButton': '.edit_marker_btn',
		},

		events: {

			'click @ui.editMarkerButton': 'onClickEditMarker',
			'submit': 'onSubmit',
			'reset': 'onReset',
		},

		templateHelpers: function () {

			return {

				'marker': this._radio.reqres.request('poiLayerHtmlIcon', this.model),
			};
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');

			this._oldModel = this.model.clone();

			this.listenTo(this.model, 'change', this.updateMarkerIcon);
		},

		onRender: function () {

			this.ui.layerDataEditable.prop('checked', this.model.get('dataEditable'));
		},

		open: function () {

			this.triggerMethod('open');
		},

		close: function () {

			this.triggerMethod('close');
		},

		updateMarkerIcon: function () {

			var html = this._radio.reqres.request('poiLayerHtmlIcon', this.model);

			this.ui.markerWrapper.html( html );
		},

		onClickEditMarker: function () {

			this._radio.commands.execute( 'modal:showEditPoiMarker', this.model );
		},

		onSubmit: function (e) {

			e.preventDefault();

			var self = this,
			addToCollection = false,
			updateMarkers = false,
			updatePopups = false;

			this.model.set('name', this.ui.layerName.val());
			this.model.set('description', this.ui.layerDescription.val());
			this.model.set('dataEditable', this.ui.layerDataEditable.prop('checked'));
			this.model.set('overpassRequest', this.ui.layerOverpassRequest.val());
			this.model.set('popupContent', this.ui.layerPopupContent.val());

			if ( !this.model.get('_id') ) {

				addToCollection = true;
			}

			if ( this._oldModel.get('dataEditable') !== this.model.get('dataEditable') ) {

				updatePopups = true;
			}

			if ( this._oldModel.get('markerColor') !== this.model.get('markerColor') ) {

				updateMarkers = true;
			}

			if ( this._oldModel.get('markerIcon') !== this.model.get('markerIcon') ) {

				updateMarkers = true;
			}

			if ( this._oldModel.get('markerShape') !== this.model.get('markerShape') ) {

				updateMarkers = true;
			}

			if ( this._oldModel.get('popupContent') !== this.model.get('popupContent') ) {

				updatePopups = true;
			}

			this.model.save({}, {

				'success': function () {

					if ( addToCollection ) {

						self._radio.reqres.request('poiLayers').add( self.model );
					}

					if ( updateMarkers ) {

						self._radio.commands.execute('map:updatePoiLayerIcons', self.model);
					}

					if ( updatePopups ) {

						self._radio.commands.execute('map:updatePoiLayerPopups', self.model);
					}

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

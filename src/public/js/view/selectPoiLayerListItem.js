

define([

	'underscore',
	'backbone',
	'settings',
	'markdown',
],
function (

	_,
	Backbone,
	settings,
	markdown
) {

	'use strict';

	return Marionette.ItemView.extend({

		template: JST['selectPoiLayerListItem.html'],

		tagName: 'a',

		className: 'list-group-item',

		attributes: {

			'href': '#',
		},

		modelEvents: {

			'change': 'render'
		},

		ui: {

			'visibilityCheckbox': '.visibility_checkbox',
			'zoomTip': '.zoom_tip',
		},

		events: {

			'click': 'onClick',
			'click label': 'onClickLabel',
		},

		initialize: function () {

			this._radio = Backbone.Wreqr.radio.channel('global');

			var self = this,
			fragment = this._radio.reqres.request('getFragment'),
			storage = JSON.parse( localStorage.getItem( 'mapState-'+ fragment ) );


			this._fragment = fragment;

			if ( storage.hiddenPoiLayers && storage.hiddenPoiLayers.indexOf(this.model.get('_id')) > -1 ) {

				this._layerIsVisible = false;
			}
			else {

				this._layerIsVisible = true;
			}

			this._radio.vent.on('map:zoomChanged', this.render, this);
		},

		templateHelpers: function () {

			return {

				'description': markdown.toHTML( this.model.get('description') ),
				'marker': this._radio.reqres.request('poiLayerHtmlIcon', this.model),
			};
		},

		onRender: function () {

			var currentZoom = this._radio.reqres.request('map:getCurrentZoom'),
			n = (this.model.get('minZoom') - currentZoom) || 0;

			if ( n > 0 ) {

				this.ui.zoomTip
				.html( document.l10n.getSync('selectPoiColumn_needToZoom', {'n': n}) )
				.removeClass('hide');
			}
			else {

				this.ui.zoomTip
				.addClass('hide')
				.empty();
			}

			this.ui.visibilityCheckbox.prop('checked', this._layerIsVisible);
		},

		onClick: function (e) {

			e.stopPropagation();

			var newState,
			key = 'mapState-'+ this._fragment,
			oldState = JSON.parse( localStorage.getItem( key ) ),
			hiddenPoiLayers = oldState.hiddenPoiLayers;

			if ( !hiddenPoiLayers ) {

				hiddenPoiLayers = [];
			}

			this._layerIsVisible = this._layerIsVisible ? false : true;

			this.ui.visibilityCheckbox[0].checked = this._layerIsVisible;

			if ( this._layerIsVisible ) {

				this._radio.commands.execute( 'map:showPoiLayer', this.model );

				hiddenPoiLayers = _.without( hiddenPoiLayers, this.model.get('_id') );
			}
			else {

				this._radio.commands.execute( 'map:hidePoiLayer', this.model );

				hiddenPoiLayers = _.union( hiddenPoiLayers, [this.model.get('_id')] );
			}

			newState = _.extend( oldState, { 'hiddenPoiLayers': hiddenPoiLayers } );
			localStorage.setItem( key, JSON.stringify( newState ) );
		},

		onClickLabel: function (e) {

			e.preventDefault();
		},
	});
});

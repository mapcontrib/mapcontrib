

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

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');

			this._layerIsVisible = true;

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

			this._layerIsVisible = this._layerIsVisible ? false : true;

			this.ui.visibilityCheckbox[0].checked = this._layerIsVisible;

			if ( this._layerIsVisible ) {

				this._radio.commands.execute( 'map:showPoiLayer', this.model );
			}
			else {

				this._radio.commands.execute( 'map:hidePoiLayer', this.model );
			}
		},

		onClickLabel: function (e) {

			e.preventDefault();
		},
	});
});

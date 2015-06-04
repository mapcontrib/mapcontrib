

define([

	'underscore',
	'backbone',
	'settings',
],
function (

	_,
	Backbone,
	settings
) {

	'use strict';

	return Marionette.ItemView.extend({

		template: JST['poiLayerListItem.html'],

		tagName: 'a',

		className: 'list-group-item',

		attributes: {

			'href': '#',
		},

		modelEvents: {

			'change': 'render'
		},

		ui: {

			'visibilityCheckbox': '.visibility_checkbox'
		},

		events: {

			'click': 'onClick',
			'click label': 'onClickLabel',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');

			this._layerIsVisible = true;
		},

		onRender: function () {

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

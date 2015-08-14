

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

		template: JST['editPoiLayerListItem.html'],

		tagName: 'a',

		className: 'list-group-item',

		attributes: {

			'href': '#',
		},

		modelEvents: {

			'change': 'render'
		},

		ui: {

			'remove_btn': '.remove_btn'
		},

		events: {

			'click': 'onClick',
			'click @ui.remove_btn': 'onClickRemove',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');
		},

		templateHelpers: function () {

			return {

				'marker': this._radio.reqres.request('poiLayerHtmlIcon', this.model),
			};
		},

		onRender: function () {

			this.el.id = 'poi-layer-'+ this.model.cid;
		},

		onClick: function () {

			this._radio.commands.execute( 'column:showPoiLayer', this.model );
		},

		onClickRemove: function (e) {

			e.stopPropagation();

			this.model.destroy();
		},
	});
});

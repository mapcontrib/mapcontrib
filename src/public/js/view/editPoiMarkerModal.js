

define([

	'underscore',
	'backbone',
	'marionette',
	'bootstrap',
	'templates',
	'text!icons.json',
],
function (

	_,
	Backbone,
	Marionette,
	Bootstrap,
	templates,
	icons
) {

	'use strict';

	return Marionette.ItemView.extend({

		template: JST['editPoiMarkerModal.html'],

		behaviors: {

			'l20n': {},
			'modal': {},
		},

		ui: {

			'modal': '#edit_poi_marker_modal',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');

			this._icons = JSON.parse(icons);
		},

		close: function () {

			this.triggerMethod('close');
		},
	});
});



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
			'colorButtons': '.colorButtons .btn',
			'shapeButtons': '.shapeButtons .btn',
			'closeButton': '.close_btn',
		},

		events: {

			'click @ui.colorButtons': 'onClickColorButtons',
			'click @ui.shapeButtons': 'onClickShapeButtons',

			'submit': 'onSubmit',
			'reset': 'onReset',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');

			this._oldModel = this.model.clone();

			this._icons = JSON.parse(icons);
		},

		onRender: function () {

			this.ui.colorButtons
			.filter( '.'+ this.model.get('markerColor') )
			.find('i')
			.addClass('fa-check');

			this.ui.shapeButtons
			.filter( '.'+ this.model.get('markerShape') )
			.addClass('active');
		},

		close: function () {

			this.triggerMethod('close');
		},

		onReset: function () {

			this.model.set( this._oldModel.toJSON() );

			this.close();
		},

		onSubmit: function (e) {

			e.preventDefault();

			this.close();
		},

		onClickColorButtons: function (e) {

			$('i', this.ui.colorButtons).removeClass('fa-check');

			e.target.querySelector('i').classList.add('fa-check');

			this.model.set('markerColor', e.target.dataset.color);
		},

		onClickShapeButtons: function (e) {

			this.ui.shapeButtons.removeClass('active');

			e.target.classList.add('active');

			this.model.set('markerShape', e.target.dataset.shape);
		},
	});
});

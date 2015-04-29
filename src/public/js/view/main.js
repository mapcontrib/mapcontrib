

define([

	'underscore',
	'backbone',
	'marionette',
	'bootstrap',
	'templates',
	'leaflet',
],
function (

	_,
	Backbone,
	Marionette,
	Bootstrap,
	templates,
	L
) {

	'use strict';

	return Marionette.LayoutView.extend({

		template: JST['main.html'],

		ui: {

			'map': '#main_map',
			'zoomInBtn': '.zoom_in_btn',
			'zoomOutBtn': '.zoom_out_btn',
			'locateBtn': '.locate_btn',
			'userBtn': '.user_btn',
			'editBtn': '.edit_btn',
			'editColumn': '#edit_column',
			'helpBtn': '.help_btn',
		},

		events: {

			'click @ui.zoomInBtn': 'onZoomIn',
			'click @ui.zoomOutBtn': 'onZoomOut',
			'click @ui.editBtn': 'onEdit',
			'click @ui.editColumn .close_btn': 'onCloseEdit',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');
		},

		onRender: function () {

			var tooltipOptions = {

				'container': 'body',
				'delay': {

					'show': 500,
					'hide': 0
				}
			};

			this.ui.zoomInBtn.tooltip( tooltipOptions );
			this.ui.zoomOutBtn.tooltip( tooltipOptions );
			this.ui.locateBtn.tooltip( tooltipOptions );
			this.ui.userBtn.tooltip( tooltipOptions );
			this.ui.editBtn.tooltip( tooltipOptions );
			this.ui.helpBtn.tooltip( tooltipOptions );
		},

		onShow: function () {

			this._map = L.map(this.ui.map[0], { 'zoomControl': false });

			this._map.setView([44.82921, -0.5834], 12);

			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

				'attribution': '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			})
			.addTo(this._map);
		},

		onZoomIn: function () {

			this._map.zoomIn();
		},

		onZoomOut: function () {

			this._map.zoomOut();
		},

		onEdit: function (e) {

			this.ui.editBtn.blur();
			this.ui.editColumn.addClass('open');
		},

		onCloseEdit: function () {

			this.ui.editColumn.removeClass('open');
		},
	});
});

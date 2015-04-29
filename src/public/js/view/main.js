

define([

	'underscore',
	'backbone',
	'marionette',
	'bootstrap',
	'templates',
	'leaflet',

	'view/tipOfTheDay',
],
function (

	_,
	Backbone,
	Marionette,
	Bootstrap,
	templates,
	L,

	tipOfTheDayView
) {

	'use strict';

	return Marionette.LayoutView.extend({

		template: JST['main.html'],

		ui: {

			'map': '#main_map',
			'toolbarButtons': '.toolbar .toolbar_btn',

			'controlToolbar': '#control_toolbar',
			'controlZoomInButton': '#control_toolbar .zoom_in_btn',
			'controlZoomOutButton': '#control_toolbar .zoom_out_btn',
			'controlLocateButton': '#control_toolbar .locate_btn',
			'controlPoiButton': '#control_toolbar .poi_btn',
			'controlTileButton': '#control_toolbar .tile_btn',

			'userToolbar': '#user_toolbar',
			'userUserButton': '#user_toolbar .user_btn',
			'userShareButton': '#user_toolbar .share_btn',
			'userEditButton': '#user_toolbar .edit_btn',

			'helpToolbar': '#help_toolbar',
			'helpHelpButton': '#help_toolbar .help_btn',

			'editToolbar': '#edit_toolbar',
			'editSettingsButton': '#edit_toolbar .settings_btn',
			'editPoiButton': '#edit_toolbar .poi_btn',
			'editTileButton': '#edit_toolbar .tile_btn',

			'userColumn': '#user_column',
			'editColumn': '#edit_column',
		},

		regions: {

			'tipOfTheDay': '#rg_tip_of_the_day',
			'editContent': '@ui.editWindow .content',
		},

		events: {

			'click @ui.controlZoomInButton': 'onZoomIn',
			'click @ui.controlZoomOutButton': 'onZoomOut',

			'click @ui.userUserButton': 'onClickUser',
			'click @ui.userColumn .close_btn': 'onCloseUser',

			'click @ui.userEditButton': 'onClickEdit',
			'click @ui.editColumn .close_btn': 'onCloseEdit',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');
		},

		onRender: function () {

			this.ui.toolbarButtons.tooltip({

				'container': 'body',
				'delay': {

					'show': 500,
					'hide': 0
				}
			});

			this.getRegion('tipOfTheDay').show( new tipOfTheDayView() );
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

		onClickEdit: function () {

			this.ui.userEditButton.blur();
			this.ui.editToolbar.toggleClass('open');
		},

		onCloseEdit: function () {

			this.ui.editColumn.removeClass('open');
		},

		onClickUser: function () {

			this.ui.userUserButton.blur();
			this.ui.userColumn.addClass('open');
		},

		onCloseUser: function () {

			this.ui.userColumn.removeClass('open');
		},
	});
});

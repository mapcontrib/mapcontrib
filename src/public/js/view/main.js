

define([

	'underscore',
	'backbone',
	'marionette',
	'bootstrap',
	'templates',
	'leaflet',
	'leaflet-layer-overpass',

	'view/loginModal',
	'view/userColumn',
	'view/shareColumn',
	'view/contribColumn',
	'view/editSettingColumn',
	'view/editPoiColumn',
	'view/editTileColumn',
	'view/tipOfTheDay',

	'model/profile',
],
function (

	_,
	Backbone,
	Marionette,
	Bootstrap,
	templates,
	L,
	overpasseLayer,

	LoginModalView,
	UserColumnView,
	ShareColumnView,
	ContribColumnView,
	EditSettingColumnView,
	EditPoiColumnView,
	EditTileColumnView,
	TipOfTheDayView,

	ProfileModel
) {

	'use strict';

	return Marionette.LayoutView.extend({

		template: JST['main.html'],

		behaviors: {

			'l20n': {},
		},

		ui: {

			'map': '#main_map',
			'title': '#title h1',
			'toolbarButtons': '.toolbar .toolbar_btn',

			'controlToolbar': '#control_toolbar',
			'zoomInButton': '#control_toolbar .zoom_in_btn',
			'zoomOutButton': '#control_toolbar .zoom_out_btn',
			'locateButton': '#control_toolbar .locate_btn',
			'locateWaitButton': '#control_toolbar .locate_wait_btn',
			'expandScreenButton': '#control_toolbar .expand_screen_btn',
			'compressScreenButton': '#control_toolbar .compress_screen_btn',
			'controlPoiButton': '#control_toolbar .poi_btn',
			'controlTileButton': '#control_toolbar .tile_btn',

			'userToolbar': '#user_toolbar',
			'loginButton': '#user_toolbar .login_btn',
			'userButton': '#user_toolbar .user_btn',
			'shareButton': '#user_toolbar .share_btn',
			'contribButton': '#user_toolbar .contrib_btn',
			'editButton': '#user_toolbar .edit_btn',

			'helpToolbar': '#help_toolbar',
			'helpButton': '#help_toolbar .help_btn',

			'editToolbar': '#edit_toolbar',
			'editSettingButton': '#edit_toolbar .setting_btn',
			'editPoiButton': '#edit_toolbar .poi_btn',
			'editTileButton': '#edit_toolbar .tile_btn',
		},

		regions: {

			'loginModal': '#rg_login_modal',

			'userColumn': '#rg_user_column',
			'shareColumn': '#rg_share_column',
			'contribColumn': '#rg_contrib_column',
			'editSettingColumn': '#rg_edit_setting_column',
			'editPoiColumn': '#rg_edit_poi_column',
			'editTileColumn': '#rg_edit_tile_column',

			'tipOfTheDay': '#rg_tip_of_the_day',
		},

		events: {

			'click @ui.zoomInButton': 'onClickZoomIn',
			'click @ui.zoomOutButton': 'onClickZoomOut',
			'click @ui.locateButton': 'onClickLocate',
			'click @ui.locateWaitButton': 'onClickLocateWait',
			'click @ui.expandScreenButton': 'onClickExpandScreen',
			'click @ui.compressScreenButton': 'onClickCompressScreen',

			'click @ui.loginButton': 'onClickLogin',
			'click @ui.userButton': 'onClickUser',
			'click @ui.shareButton': 'onClickShare',
			'click @ui.contribButton': 'onClickContrib',
			'click @ui.editButton': 'onClickEdit',
			'click @ui.editSettingButton': 'onClickEditSetting',
			'click @ui.editPoiButton': 'onClickEditPoi',
			'click @ui.editTileButton': 'onClickEditTile',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');

			this.model = new ProfileModel({

				'_id': '5249c43c6e789470197b5973',
			});

			this.model.fetch({

				'async': false,
			});

			this.listenTo(this.model, 'change:name', this.setTitle);
		},

		onRender: function () {

			var self = this;

			document.title = document.l10n.getSync('pageTitleWithMapName', {

				'map': {

					'name': this.model.get('name')
				}
			});


			if ( this._radio.reqres.request('var', 'isLogged') ) {

				var user = this._radio.reqres.request('model', 'user'),
				avatar = user.get('avatar'),
				letters = user.get('displayName')
				.toUpperCase()
				.split(' ')
				.splice(0, 3)
				.map(function (name) {

					return name[0];
				})
				.join('');

				if (letters.length > 3) {

					letters = letters[0];
				}


				if (avatar) {

					this.ui.userButton
					.addClass('avatar')
					.html('<img src="'+ avatar +'" alt="'+ letters +'">');
				}
				else {

					this.ui.userButton
					.removeClass('avatar')
					.html(letters);
				}

				this.ui.loginButton.addClass('hide');
				this.ui.userButton.removeClass('hide');
				this.ui.editButton.removeClass('hide');
			}
			else {

				this.ui.loginButton.removeClass('hide');
				this.ui.userButton.addClass('hide');
				this.ui.editButton.addClass('hide');
			}


			this._userColumnView = new UserColumnView();
			this._shareColumnView = new ShareColumnView({ 'model': this.model });
			this._contribColumnView = new ContribColumnView({ 'model': this.model });
			this._editSettingColumnView = new EditSettingColumnView({ 'model': this.model });
			this._editPoiColumnView = new EditPoiColumnView({ 'model': this.model });
			this._editTileColumnView = new EditTileColumnView({ 'model': this.model });

			this.getRegion('userColumn').show( this._userColumnView );
			this.getRegion('shareColumn').show( this._shareColumnView );
			this.getRegion('contribColumn').show( this._contribColumnView );
			this.getRegion('editSettingColumn').show( this._editSettingColumnView );
			this.getRegion('editPoiColumn').show( this._editPoiColumnView );
			this.getRegion('editTileColumn').show( this._editTileColumnView );

			this.getRegion('tipOfTheDay').show( new TipOfTheDayView() );



			if ( !document.fullscreenEnabled) {

				this.ui.expandScreenButton.addClass('hide');
				this.ui.compressScreenButton.addClass('hide');
			}

			$(window).on('fullscreenchange', function () {

				if ( document.fullscreenElement ) {

					self.onExpandScreen();
				}
				else {

					self.onCompressScreen();
				}
			});
		},

		onShow: function () {

			var self = this,
			center = this.model.get('center'),
			zoomLevel = this.model.get('zoomLevel');


			this.ui.toolbarButtons.tooltip({

				'container': 'body',
				'delay': {

					'show': 500,
					'hide': 0
				}
			})
			.on('click', function () {

				$(this).blur();
			});


			this._map = L.map(this.ui.map[0], { 'zoomControl': false });

			this._radio.reqres.removeHandler('map');
			this._radio.reqres.setHandler('map', function () {

				return self._map;
			});

			this._map
			.setView([center.lat, center.lng], zoomLevel)
			.on('locationfound', function () {

				self.onLocationFound();
			})
			.on('locationerror', function () {

				self.onLocationError();
			});


			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

				'attribution': '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			})
			.addTo(this._map);


			this._poiIds = [];

			this._mapLayers = {

				'recycling': L.layerGroup([

					new L.OverPassLayer({

						// 'endpoint': 'http://api.openstreetmap.fr/oapi/',
						'endpoint': 'http://overpass.osm.rambler.ru/cgi/',
						'minzoom': 14,
						'query': "(node(BBOX)['amenity'='recycling'];relation(BBOX)['amenity'='recycling'];way(BBOX)['amenity'='recycling']);out body center;>;out;",
						'callback': function(data){

							var wayBodyNodes = {};

							data.elements.forEach(function (e) {

								if ( e.tags ) {

									return;
								}

								wayBodyNodes[e.id] = e;
							});


							data.elements.forEach(function (e) {

								var pos,
								popupContent = '';

								if( !e.tags ) {

									return;
								}

								if ( self._poiIds.indexOf(e.id) > -1 ) {

									return;
								}

								self._poiIds.push(e.id);


								if(e.tags.name) {

									popupContent += '<h3>' + e.tags.name + '</h3>';
								}
								else {

									popupContent += '<h3 class="text-muted">Sans nom</h3>';
								}


								if(e.type === 'node') {

									pos = new L.LatLng(e.lat, e.lon);
								}
								else {

									pos = new L.LatLng(e.center.lat, e.center.lon);

									if ( e.nodes ) {

										var nodePositions = [];

										e.nodes.forEach(function (node) {

											if ( wayBodyNodes[node] ) {

												nodePositions.push(

													L.latLng(

														wayBodyNodes[node].lat,
														wayBodyNodes[node].lon
													)
												);
											}
										});

										self._map.addLayer(

											L.polygon( nodePositions ).bindPopup(popupContent)
										);
									}
								}

								self._map.addLayer(

									L.marker(pos, {

										'icon': L.icon({

											iconUrl: 'img/leaf-green.png',
											shadowUrl: 'img/leaf-shadow.png',

											iconSize:     [38, 95], // size of the icon
											shadowSize:   [50, 64], // size of the shadow
											iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
											shadowAnchor: [4, 62],  // the same for the shadow
											popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
										})
									})
									.bindPopup(popupContent)
								);
							});
						}
					}),
				]),
			};

			this._map.addLayer(this._mapLayers.recycling);
		},

		setTitle: function () {

			this.ui.title.html( this.model.get('name') );
		},

		onClickZoomIn: function () {

			this._map.zoomIn();
		},

		onClickZoomOut: function () {

			this._map.zoomOut();
		},

		onClickLocate: function () {

			this.ui.locateButton.addClass('hide');
			this.ui.locateWaitButton.removeClass('hide');

			this._map.locate({

				'setView': true,
				'enableHighAccuracy': true,
				'maximumAge': 60 * 1000, // 60 seconds
			});
		},

		onClickLocateWait: function () {

			this._map.stopLocate();
		},

		onLocationFound: function () {

			this.ui.locateWaitButton.addClass('hide');
			this.ui.locateButton.removeClass('hide');
		},

		onLocationError: function () {

			this.ui.locateWaitButton.addClass('hide');
			this.ui.locateButton.removeClass('hide');

			// FIXME
			// Give some feedback to the user
		},

		onClickExpandScreen: function () {

			document.documentElement.requestFullscreen();
		},

		onClickCompressScreen: function () {

			document.exitFullscreen();
		},

		onExpandScreen: function () {

			this.ui.expandScreenButton.addClass('hide');
			this.ui.compressScreenButton.removeClass('hide');
		},

		onCompressScreen: function () {

			this.ui.compressScreenButton.addClass('hide');
			this.ui.expandScreenButton.removeClass('hide');
		},

		onClickLogin: function () {

			var self = this;

			this._loginModalView = new LoginModalView();

			this.getRegion('loginModal').show( this._loginModalView );
		},

		onClickUser: function () {

			this._userColumnView.open();
		},

		onClickShare: function () {

			this._shareColumnView.open();
		},

		onClickContrib: function () {

			this._contribColumnView.open();
		},

		onClickEdit: function () {

			this.ui.editToolbar.toggleClass('open');
		},

		onClickEditSetting: function () {

			this._editSettingColumnView.open();
		},

		onClickEditPoi: function () {

			this._editPoiColumnView.open();
		},

		onClickEditTile: function () {

			this._editTileColumnView.open();
		},
	});
});

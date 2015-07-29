

define([

	'underscore',
	'backbone',
	'marionette',
	'bootstrap',
	'templates',
	'settings',
	'leaflet-control-geocoder',
],
function (

	_,
	Backbone,
	Marionette,
	Bootstrap,
	templates,
	settings,
	leafletControlGeocoder
) {

	'use strict';

	return Marionette.LayoutView.extend({

		template: JST['geocodeWidget.html'],
		templateResultItem: JST['geocodeResultItem.html'],

		behaviors: {

			'l20n': {},
			'widget': {},
		},

		ui: {

			'widget': '#geocode_widget',
			'query': 'input',
			'resultList': '.results',
		},

		events: {

			'keyup @ui.query': 'onKeyUpQuery',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');

			this._geocoder = L.Control.Geocoder.nominatim();

			this.on('open', this.onOpen);
		},

		open: function () {

			this.triggerMethod('open');
		},

		close: function () {

			this.triggerMethod('close');
		},

		toggle: function () {

			this.triggerMethod('toggle');
		},

		onOpen: function () {

			var self = this;

			this._radio.vent.trigger('column:closeAll');

			this.ui.widget.one('transitionend', function () {

				self.ui.query.focus();
			});
		},

		onKeyUpQuery: function (e) {

			if ( this._queryInterval ) {

				clearInterval(this._queryInterval);
			}

			var self = this,
			query = this.ui.query.val();

			if ( this._lastQuery && this._lastQuery === query ) {

				return false;
			}

			this._queryInterval = setTimeout(function () {

				self.geocode( query );
			}, 350);
		},

		geocode: function (query) {

			var self = this,
			elements = [];

			this._lastQuery = query;

			if ( !query ) {

				this.ui.resultList.empty();

				return;
			}

			this._geocoder.geocode(query, function(results) {

				results.forEach(function (result) {


					elements.push(

						$( self.templateResultItem({

							'name': result.name,
						}))
						.on('click', function () {

							self._radio.commands.execute('map:setPosition', result.center, 11);

							self.close();
						})
					);
				});

				self.ui.resultList.html( elements );
			});

		},
	});
});

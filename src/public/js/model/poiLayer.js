

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

	return Backbone.Model.extend({

		idAttribute: '_id',

		urlRoot: settings.apiPath + 'poiLayer',

		defaults: {

			'profileId': undefined,
			'name': undefined,
			'description': undefined,
			'overpassRequest': undefined,
			'minZoom': 14,
			'popupContent': undefined,
			'order': undefined,
			'marker': 'marker1',
			'markerColor': 'orange',
			'markerIcon': undefined,
		}
	});
});

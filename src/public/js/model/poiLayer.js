

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
			'dataEditable': true,
			'overpassRequest': undefined,
			'minZoom': 14,
			'popupContent': undefined,
			'order': undefined,
			'markerShape': 'marker1',
			'markerColor': 'orange',
			'markerIcon': undefined,
		}
	});
});

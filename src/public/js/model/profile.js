

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

		urlRoot: settings.apiPath + 'profile',

		defaults: {

			'userId': undefined,
			'name': undefined,
			'color': 'blue',
			'pois': [], // amenity, tag, icon, preset
			'tiles': [],
			'zoomLevel': undefined,
			'center': {

				'lat': undefined,
				'lng': undefined,
			},
		}
	});
});

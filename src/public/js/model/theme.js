

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

		urlRoot: settings.apiPath + 'theme',

		defaults: {

			'userId': undefined,
			'name': undefined,
			'description': undefined,
			'color': 'blue',
			'tiles': ['osm'],
			'zoomLevel': undefined,
			'center': {

				'lat': undefined,
				'lng': undefined,
			},
		}
	});
});



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

		urlRoot: settings.apiPath + 'user',

		defaults: {

			'userId': undefined,
			'title': undefined,
			'pois': [], // amenity, tag, icon, preset
			'tiles': [],
			'zoomLevel': undefined,
			'center': undefined,
		}
	});
});

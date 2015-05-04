

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

			'osmId': undefined,
			'displayName': undefined,
			'tocken': undefined,
			'tockenSecret': undefined,
		}
	});
});

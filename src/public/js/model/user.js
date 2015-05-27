

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
			'avatar': undefined,
			'token': undefined,
			'tokenSecret': undefined,
		}
	});
});

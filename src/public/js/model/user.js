

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
			'structure_id': undefined,
			'nom': undefined,
			'login': undefined
		}
	});
});

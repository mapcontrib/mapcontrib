

define([

	'underscore',
	'backbone',
	'marionette',
	'bootstrap',
	'templates',
	'view/selectPoiLayerListItem',
],
function (

	_,
	Backbone,
	Marionette,
	Bootstrap,
	templates,
	SelectPoiLayerListItemView
) {

	'use strict';

	return Marionette.CollectionView.extend({

		childView: SelectPoiLayerListItemView,

		className: 'list-group',
	});
});

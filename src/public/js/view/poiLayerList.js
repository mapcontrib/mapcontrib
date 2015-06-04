

define([

	'underscore',
	'backbone',
	'marionette',
	'bootstrap',
	'templates',
	'view/poiLayerListItem',
],
function (

	_,
	Backbone,
	Marionette,
	Bootstrap,
	templates,
	PoiLayerListItemView
) {

	'use strict';

	return Marionette.CollectionView.extend({

		childView: PoiLayerListItemView,

		className: 'list-group',
	});
});

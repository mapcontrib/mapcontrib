

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

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');

			this._user = this._radio.reqres.request('model', 'user');
		},

		addChild: function(child, ChildView, index){

			if ( child.get('visible') || this._user.get('_id') ) {

				Marionette.CollectionView.prototype.addChild.apply(this, arguments);
			}
		},
	});
});

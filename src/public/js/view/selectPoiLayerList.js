

define([

    'underscore',
    'backbone',
    'backbone.marionette',
    '../../templates/templates',
    './selectPoiLayerListItem',
],
function (

    _,
    Backbone,
    Marionette,
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

            if ( child.isVisible() ) {

                Marionette.CollectionView.prototype.addChild.apply(this, arguments);
            }
        },
    });
});

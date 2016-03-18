
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');
var JST = require('../../templates/templates');
var SelectPoiLayerListItemView = require('./selectPoiLayerListItem');


module.exports = Marionette.CollectionView.extend({

    childView: SelectPoiLayerListItemView,

    className: 'list-group',

    initialize: function () {

        var self = this;

        this._radio = Wreqr.radio.channel('global');

        this._user = this._radio.reqres.request('model', 'user');
    },

    addChild: function(child, ChildView, index){

        if ( child.isVisible() ) {

            Marionette.CollectionView.prototype.addChild.apply(this, arguments);
        }
    },
});

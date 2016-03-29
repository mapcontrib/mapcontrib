
var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');
var MapUi = require('../ui/map');


module.exports = Marionette.ItemView.extend({

    template: require('../../templates/editPoiLayerListItem.ejs'),

    tagName: 'a',

    className: 'list-group-item',

    attributes: {

        'href': '#',
    },

    modelEvents: {

        'change': 'render'
    },

    ui: {

        'remove_btn': '.remove_btn'
    },

    events: {

        'click': 'onClick',
        'click @ui.remove_btn': 'onClickRemove',
    },

    initialize: function () {

        var self = this;

        this._radio = Wreqr.radio.channel('global');
    },

    templateHelpers: function () {

        return {

            'marker': MapUi.buildPoiLayerHtmlIcon( this.model ),
        };
    },

    onRender: function () {

        this.el.id = 'poi-layer-'+ this.model.cid;
    },

    onClick: function () {

        this._radio.commands.execute( 'column:showPoiLayer', this.model );
    },

    onClickRemove: function (e) {

        e.stopPropagation();

        this.model.destroy();
    },
});



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

    return Marionette.ItemView.extend({

        template: JST['editPresetListItem.html'],

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

            this._radio = Backbone.Wreqr.radio.channel('global');
        },

        onRender: function () {

            this.el.id = 'preset-'+ this.model.cid;
        },

        onClick: function () {

            this._radio.commands.execute( 'column:showPresetTags', this.model );
        },

        onClickRemove: function (e) {

            e.stopPropagation();

            this.model.destroy();
        },
    });
});

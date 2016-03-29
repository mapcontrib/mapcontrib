
var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');


module.exports = Marionette.ItemView.extend({

    template: require('../../templates/editPresetListItem.ejs'),

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

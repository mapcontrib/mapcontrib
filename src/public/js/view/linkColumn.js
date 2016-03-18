
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var JST = require('../../templates/templates');
var settings = require('../settings');


module.exports = Marionette.LayoutView.extend({

    template: JST['linkColumn.html'],
    templateIframe: JST['linkColumnIframe.html'],

    behaviors: {

        'l20n': {},
        'column': {},
    },

    ui: {

        'column': '#link_column',
        'autoSelects': '.auto_select',
        'iframeCode': '#iframe_code',
        'iframeWidth': '#iframe_width',
        'iframeHeight': '#iframe_height',
        'iframeWidthUnit': '#iframe_width_unit',
        'iframeHeightUnit': '#iframe_height_unit',
        'iframeWidthUnitDropdown': '#iframe_width_unit_dropdown',
        'iframeHeightUnitDropdown': '#iframe_height_unit_dropdown',
    },

    events: {

        'click @ui.autoSelects': 'onClickAutoSelects',
        'keyup @ui.iframeWidth, @ui.iframeHeight': 'renderIframeCode',
        'change @ui.iframeWidth, @ui.iframeHeight': 'renderIframeCode',
        'click @ui.iframeWidthUnitDropdown a': 'onClickWidthUnit',
        'click @ui.iframeHeightUnitDropdown a': 'onClickHeightUnit',
    },

    templateHelpers: function () {


        return {

            'url': this.getUrl(),
            'iframeWidth': settings.shareIframeWidth,
            'iframeWidthUnit': settings.shareIframeWidthUnit,
            'iframeHeight': settings.shareIframeHeight,
            'iframeHeightUnit': settings.shareIframeHeightUnit,
        };
    },

    initialize: function () {

        var self = this;

        this._radio = Backbone.Wreqr.radio.channel('global');
    },

    onBeforeOpen: function () {

        this._radio.vent.trigger('column:closeAll');
        this._radio.vent.trigger('widget:closeAll');
    },

    open: function () {

        this.triggerMethod('open');
    },

    close: function () {

        this.triggerMethod('close');
    },

    onRender: function () {

        this.renderIframeCode();
    },

    renderIframeCode: function () {

        var html = this.templateIframe({

            'url': this.getUrl(),
            'iframeWidth': this.ui.iframeWidth.val(),
            'iframeHeight': this.ui.iframeHeight.val(),
            'iframeWidthUnit': (this.ui.iframeWidthUnit.html() == 'px') ? '' : this.ui.iframeWidthUnit.html(),
            'iframeHeightUnit': (this.ui.iframeHeightUnit.html() == 'px') ? '' : this.ui.iframeHeightUnit.html(),
            'subLinkMessage': document.l10n.getSync('linkColumn_seeBigger'),
        });

        this.ui.iframeCode.html( html );
    },

    onClickAutoSelects: function (e) {

        e.target.select();
    },

    onClickWidthUnit: function (e) {

        e.preventDefault();

        this.ui.iframeWidthUnit.html( $(e.target).data('unit') );

        this.renderIframeCode();
    },

    onClickHeightUnit: function (e) {

        e.preventDefault();

        this.ui.iframeHeightUnit.html( $(e.target).data('unit') );

        this.renderIframeCode();
    },

    getUrl: function () {

        return window.location.protocol +'//'+ window.location.host +'/theme-'+ this.model.get('fragment');
    },
});


'use strict';


var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var Bootstrap = require('bootstrap');
var JST = require('../../templates/templates');
var CONST = require('../const');
var icons = require('../icons.json');


module.exports = Marionette.ItemView.extend({

    template: JST['editPoiMarkerModal.html'],

    behaviors: {

        'l20n': {},
        'modal': {},
    },

    ui: {

        'modal': '#edit_poi_marker_modal',
        'colorButtons': '.color-buttons .btn',
        'shapeButtons': '.shape-buttons .btn',
        'iconTypeTabs': '.marker_icon_type_tab',
        'iconTypeLibraryTab': '#iconTypeLibraryTab',
        'iconTypeLibraryForm': '.form-library',
        'iconTypeExternalTab': '#iconTypeExternalTab',
        'iconTypeExternalForm': '.form-external',
        'iconNameInput': '#markerIconName',
        'iconUrlInput': '#markerIconUrl',
        'iconPreview': '.icon-preview',
        'closeButton': '.close_btn',
    },

    events: {

        'click @ui.colorButtons': 'onClickColorButtons',
        'click @ui.shapeButtons': 'onClickShapeButtons',
        'click @ui.iconTypeLibraryTab': 'onClickIconTypeLibraryTab',
        'click @ui.iconTypeExternalTab': 'onClickIconTypeExternalTab',
        'keyup @ui.iconNameInput': 'onChangeIconName',
        'blur @ui.iconNameInput': 'onChangeIconName',
        'keyup @ui.iconUrlInput': 'onChangeIconUrl',
        'blur @ui.iconUrlInput': 'onChangeIconUrl',

        'submit': 'onSubmit',
        'reset': 'onReset',
    },

    initialize: function () {

        var self = this;

        this._radio = Backbone.Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();

        this._icons = JSON.parse(icons);
    },

    onRender: function () {

        this.ui.colorButtons
        .filter( '.'+ this.model.get('markerColor') )
        .find('i')
        .addClass('fa-check');

        this.ui.shapeButtons
        .filter( '.'+ this.model.get('markerShape') )
        .addClass('active');

        this.ui.iconTypeTabs.removeClass('active');

        switch ( this.model.get('markerIconType') ) {

            case CONST.map.markerIconType.external:
                this.ui.iconTypeExternalTab.addClass('active').click();
                break;

            default:
            case CONST.map.markerIconType.library:
                this.ui.iconTypeLibraryTab.addClass('active').click();
        }

        this.updateIconPreview();
    },

    close: function () {

        this.triggerMethod('close');
    },

    onReset: function () {

        this.model.set( this._oldModel.toJSON() );

        this.close();
    },

    onSubmit: function (e) {

        e.preventDefault();

        this.close();
    },

    onClickColorButtons: function (e) {

        $('i', this.ui.colorButtons).removeClass('fa-check');

        e.target.querySelector('i').classList.add('fa-check');

        this.model.set('markerColor', e.target.dataset.color);
    },

    onClickShapeButtons: function (e) {

        this.ui.shapeButtons.removeClass('active');

        e.target.classList.add('active');

        this.model.set('markerShape', e.target.dataset.shape);
    },

    onChangeIconName: function (e) {

        this.updateIconPreview();
    },

    onChangeIconUrl: function (e) {

        this.model.set('markerIconUrl', e.target.value);
    },

    updateIconPreview: function () {

        var iconName = this.ui.iconNameInput.val();

        this.ui.iconPreview.attr('class', 'icon-preview fa fa-'+ iconName);

        this.model.set('markerIcon', iconName);
    },

    onClickIconTypeLibraryTab: function (e) {

        this.ui.iconTypeExternalForm.addClass('hide');
        this.ui.iconTypeLibraryForm.removeClass('hide');

        this.model.set('markerIconType', CONST.map.markerIconType.library);
    },

    onClickIconTypeExternalTab: function (e) {

        this.ui.iconTypeLibraryForm.addClass('hide');
        this.ui.iconTypeExternalForm.removeClass('hide');

        this.model.set('markerIconType', CONST.map.markerIconType.external);
    }
});


'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');
var JST = require('../../templates/templates');


module.exports = Marionette.ItemView.extend({

    template: JST['editSettingColumn.html'],

    behaviors: {

        'l20n': {},
        'column': {},
    },

    ui: {

        'column': '#edit_setting_column',

        'themeName': '#theme_name',
        'themeDescription': '#theme_description',
        'colorButtons': '.color-buttons .btn',
        'themePositionKeepOld': '#theme_position_keep_old',
        'themePositionSetNew': '#theme_position_set_new',
    },

    events: {

        'mouseover @ui.colorButtons': 'onOverColorButtons',
        'mouseleave @ui.colorButtons': 'onLeaveColorButtons',
        'click @ui.colorButtons': 'onClickColorButtons',

        'submit': 'onSubmit',
        'reset': 'onReset',
    },

    initialize: function () {

        var self = this;

        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();
    },

    onRender: function () {

        this.ui.colorButtons
        .filter( '.'+ this.model.get('color') )
        .find('i')
        .addClass('fa-check');
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

    onSubmit: function (e) {

        e.preventDefault();

        var self = this,
        map = this._radio.reqres.request('map'),
        mapCenter = map.getCenter(),
        mapZoomLevel = map.getZoom();

        this.model.set('name', this.ui.themeName.val());
        this.model.set('description', this.ui.themeDescription.val());

        if ( this.ui.themePositionSetNew.prop('checked') === true ) {

            this.model.set('center', mapCenter);
            this.model.set('zoomLevel', mapZoomLevel);
        }

        this.model.save({}, {

            'success': function () {

                self._oldModel = self.model.clone();

                self.close();
            },
            'error': function () {

                // FIXME
                console.error('nok');
            },
        });
    },

    onReset: function () {

        this.model.set( this._oldModel.toJSON() );

        this._radio.commands.execute('ui:setTitleColor', this.model.get('color'));

        this.ui.column.one('transitionend', this.render);

        this.close();
    },

    onOverColorButtons: function (e) {

        this._radio.commands.execute('ui:setTitleColor', e.target.dataset.color);
    },

    onLeaveColorButtons: function (e) {

        this._radio.commands.execute('ui:setTitleColor', this.model.get('color'));
    },

    onClickColorButtons: function (e) {

        $('i', this.ui.colorButtons).removeClass('fa-check');

        e.target.querySelector('i').classList.add('fa-check');

        this.model.set('color', e.target.dataset.color);
    },
});

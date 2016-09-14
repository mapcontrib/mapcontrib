
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/admin/tag/tagEditColumn.ejs';
import CONST from 'const';


export default Marionette.ItemView.extend({
    template,

    behaviors() {
        return {
            l20n: {},
            column: {
                appendToBody: true,
                destroyOnClose: true,
                routeOnClose: this.options.previousRoute,
            },
        };
    },

    ui: {
        column: '.column',

        themeName: '#theme_name',
        themeDescription: '#theme_description',
        colorButtons: '.color-buttons .btn',
        themePositionKeepOld: '#theme_position_keep_old',
        themePositionSetNew: '#theme_position_set_new',
        themePositionAutoCenter: '#theme_position_auto_center',
        geocoderSection: '.geocoder',
        photonSection: '.photon',
        nominatimSection: '.nominatim',
        themeGeocoderPhoton: '#theme_geocoder_photon',
        themeGeocoderNominatim: '#theme_geocoder_nominatim',
        themeInfoDisplayPopup: '#theme_info_display_popup',
        themeInfoDisplayModal: '#theme_info_display_modal',
        themeInfoDisplayColumn: '#theme_info_display_column',
        infoAnalytics: '.info_analytics_btn',
        themeAnalyticScript: '#theme_analytic_script',
    },

    events: {
        'mouseover @ui.colorButtons': 'onOverColorButtons',
        'mouseleave @ui.colorButtons': 'onLeaveColorButtons',
        'click @ui.colorButtons': 'onClickColorButtons',

        submit: 'onSubmit',
        reset: 'onReset',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();
    },

    onRender() {

    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    onSubmit(e) {
        e.preventDefault();

        const map = this._radio.reqres.request('map');
        const mapCenter = map.getCenter();
        const mapZoomLevel = map.getZoom();
        const themeName = this.ui.themeName.val();
        const themeDescription = this.ui.themeDescription.val();
        const themeAnalyticScript = this.ui.themeAnalyticScript.val();

        this.model.set('name', themeName);
        this.model.set('description', themeDescription);
        this.model.set('analyticScript', themeAnalyticScript);
        this.model.updateModificationDate();

        window.history.pushState({}, themeName, this.model.buildPath());

        this.model.set('autoCenter', false);

        if ( this.ui.themePositionSetNew.prop('checked') === true ) {
            this.model.set('center', mapCenter);
            this.model.set('zoomLevel', mapZoomLevel);
        }

        if ( this.ui.themePositionAutoCenter.prop('checked') === true ) {
            this.model.set('autoCenter', true);
        }

        if ( this.ui.themeInfoDisplayPopup.prop('checked') === true ) {
            this.model.set('infoDisplay', CONST.infoDisplay.popup);
        }
        else if ( this.ui.themeInfoDisplayModal.prop('checked') === true ) {
            this.model.set('infoDisplay', CONST.infoDisplay.modal);
        }
        else if ( this.ui.themeInfoDisplayColumn.prop('checked') === true ) {
            this.model.set('infoDisplay', CONST.infoDisplay.column);
        }

        this.model.save({}, {
            success: () => {
                if (this.model.get('infoDisplay') !== this._oldModel.get('infoDisplay')) {
                    if (this.model.get('infoDisplay') === CONST.infoDisplay.popup) {
                        this._radio.commands.execute('map:bindAllPopups');
                    }
                    else {
                        this._radio.commands.execute('map:unbindAllPopups');
                    }
                }

                this._oldModel = this.model.clone();

                this.close();
            },
            error: () => {
                // FIXME
                console.error('nok');
            },
        });
    },

    onBeforeClose() {
        this._reset();
    },

    onReset() {
        this._reset();

        this.ui.column.one('transitionend', this.render);

        this.close();
    },

    _reset() {
        this.model.set('color', this._oldModel.get('color'));
        this._radio.commands.execute('ui:setTitleColor', this.model.get('color'));
    },
});

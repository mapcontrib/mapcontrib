
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from '../../templates/editSettingColumn.ejs';
import CONST from '../const';


export default Marionette.ItemView.extend({
    template: template,

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
        'themePositionAutoCenter': '#theme_position_auto_center',
        'geocoderSection': '.geocoder',
        'photonSection': '.photon',
        'nominatimSection': '.nominatim',
        'themeGeocoderPhoton': '#theme_geocoder_photon',
        'themeGeocoderNominatim': '#theme_geocoder_nominatim',
        'themeInfoDisplayPopup': '#theme_info_display_popup',
        'themeInfoDisplayModal': '#theme_info_display_modal',
        'themeInfoDisplayColumn': '#theme_info_display_column',
        'themeInfoDisplayFullscreen': '#theme_info_display_fullscreen',
    },

    events: {
        'mouseover @ui.colorButtons': 'onOverColorButtons',
        'mouseleave @ui.colorButtons': 'onLeaveColorButtons',
        'click @ui.colorButtons': 'onClickColorButtons',

        'submit': 'onSubmit',
        'reset': 'onReset',
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();
    },

    onRender: function () {
        const config = MAPCONTRIB.config;

        this.ui.colorButtons
        .filter( '.'+ this.model.get('color') )
        .find('i')
        .addClass('fa-check');


        if ( config.availableGeocoders.length > 1 ) {
            this.ui.geocoderSection.removeClass('hide');

            let modelGeocoder = this.model.get('geocoder');

            if ( config.availableGeocoders.indexOf(modelGeocoder) > -1 ) {
                let geocoder = modelGeocoder.ucfirst();
                this.ui[`themeGeocoder${geocoder}`].prop('checked', 'true');
            }
            else {
                let defaultGeocoder = config.defaultGeocoder.ucfirst();
                this.ui[`themeGeocoder${defaultGeocoder}`].prop('checked', 'true');
            }

            for (let geocoder in CONST.geocoder) {
                if ( config.availableGeocoders.indexOf(geocoder) > -1 ) {
                    this.ui[`${geocoder}Section`].removeClass('hide');
                }
            }
        }

        if ( this.model.get('autoCenter') === true ) {
            this.ui.themePositionAutoCenter.prop('checked', true);
        }

        switch ( this.model.get('infoDisplay') ) {
            case CONST.infoDisplay.popup:
                this.ui.themeInfoDisplayPopup.prop('checked', true);
                break;
            case CONST.infoDisplay.modal:
                this.ui.themeInfoDisplayModal.prop('checked', true);
                break;
            case CONST.infoDisplay.column:
                this.ui.themeInfoDisplayColumn.prop('checked', true);
                break;
            case CONST.infoDisplay.fullscreen:
                this.ui.themeInfoDisplayFullscreen.prop('checked', true);
                break;
        }
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

        const config = MAPCONTRIB.config;

        var map = this._radio.reqres.request('map'),
        mapCenter = map.getCenter(),
        mapZoomLevel = map.getZoom(),
        themeName = this.ui.themeName.val(),
        themeDescription = this.ui.themeDescription.val();

        this.model.set('name', themeName);
        this.model.set('description', themeDescription);
        this.model.set('modificationDate', new Date().toISOString());

        history.pushState({}, themeName, this.model.buildPath());

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
        else if ( this.ui.themeInfoDisplayFullscreen.prop('checked') === true ) {
            this.model.set('infoDisplay', CONST.infoDisplay.fullscreen);
        }

        if (config.availableGeocoders.length > 1) {
            for (let geocoder in CONST.geocoder) {
                let ucFirstGeocoder = geocoder.ucfirst();
                if ( this.ui[`themeGeocoder${ucFirstGeocoder}`].prop('checked') === true ) {
                    this.model.set('geocoder', geocoder);
                }
            }
        }


        this.model.save({}, {
            'success': () => {
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
            'error': () => {
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

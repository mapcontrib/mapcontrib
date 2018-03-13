import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/admin/setting/mainColumn.ejs';
import CONST from 'const';
import MarkedHelper from 'helper/marked';
import ThemeCore from 'core/theme';
import MapUi from 'ui/map';
import 'ui/form/colorSelector/style.less';

export default Marionette.ItemView.extend({
  template,

  behaviors() {
    return {
      l20n: {},
      column: {
        appendToBody: true,
        destroyOnClose: true,
        routeOnClose: this.options.previousRoute
      }
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
    themeMinimumZoom: '#theme_minimum_zoom',
    themeMaximumZoom: '#theme_maximum_zoom',
    themeMovementRadius: '#theme_movement_radius',
    geocoderSection: '.geocoder',
    photonSection: '.photon',
    nominatimSection: '.nominatim',
    themeGeocoderPhoton: '#theme_geocoder_photon',
    themeGeocoderNominatim: '#theme_geocoder_nominatim',
    themeInfoDisplayPopup: '#theme_info_display_popup',
    themeInfoDisplayModal: '#theme_info_display_modal',
    themeInfoDisplayColumn: '#theme_info_display_column',
    infoAnalytics: '.info_analytics_btn',
    themeAnalyticScript: '#theme_analytic_script'
  },

  events: {
    'mouseover @ui.colorButtons': 'onOverColorButtons',
    'mouseleave @ui.colorButtons': 'onLeaveColorButtons',
    'click @ui.colorButtons': 'onClickColorButtons',

    submit: 'onSubmit',
    reset: 'onReset'
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');
    this._app = this.options.app;
    this._userFavoriteThemes = this.options.app.getUserFavoriteThemes();

    this._oldModel = this.model.clone();
  },

  onRender() {
    const config = MAPCONTRIB.config;
    const color = this.model.get('color');

    this.ui.colorButtons
      .filter(`.${color}`)
      .find('i')
      .addClass('fa-check');

    if (config.availableGeocoders.length > 1) {
      this.ui.geocoderSection.removeClass('hide');

      const modelGeocoder = this.model.get('geocoder');

      if (config.availableGeocoders.indexOf(modelGeocoder) > -1) {
        const geocoder = modelGeocoder.ucfirst();
        this.ui[`themeGeocoder${geocoder}`].prop('checked', 'true');
      } else {
        const defaultGeocoder = config.defaultGeocoder.ucfirst();
        this.ui[`themeGeocoder${defaultGeocoder}`].prop('checked', 'true');
      }

      for (const geocoder in CONST.geocoder) {
        if (config.availableGeocoders.indexOf(geocoder) > -1) {
          this.ui[`${geocoder}Section`].removeClass('hide');
        }
      }
    }

    if (this.model.get('autoCenter') === true) {
      this.ui.themePositionAutoCenter.prop('checked', true);
    }

    switch (this.model.get('infoDisplay')) {
      case CONST.infoDisplay.modal:
        this.ui.themeInfoDisplayModal.prop('checked', true);
        break;
      case CONST.infoDisplay.column:
        this.ui.themeInfoDisplayColumn.prop('checked', true);
        break;
      case CONST.infoDisplay.popup:
        this.ui.themeInfoDisplayPopup.prop('checked', true);
        break;
      default:
        this.ui.themeInfoDisplayPopup.prop('checked', true);
        break;
    }

    this.ui.infoAnalytics.popover({
      container: 'body',
      placement: 'left',
      trigger: 'focus',
      html: true,
      title: document.l10n.getSync(
        'editSettingColumn_infoAnalyticsPopoverTitle'
      ),
      content: MarkedHelper.render(
        document.l10n.getSync('editSettingColumn_infoAnalyticsPopoverContent')
      )
    });
  },

  onBeforeOpen() {
    this._radio.vent.trigger('column:closeAll', [this.cid]);
    this._radio.vent.trigger('widget:closeAll', [this.cid]);
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

    const config = MAPCONTRIB.config;

    const map = this._radio.reqres.request('map');
    const mapCenter = map.getCenter();
    const mapZoomLevel = map.getZoom();
    const themeName = this.ui.themeName.val();
    const themeDescription = this.ui.themeDescription.val();
    const themeAnalyticScript = this.ui.themeAnalyticScript.val();
    const themeMinimumZoom = this.ui.themeMinimumZoom.val();
    const themeMaximumZoom = this.ui.themeMaximumZoom.val();
    const themeMovementRadius = this.ui.themeMovementRadius.val();

    this.model.set('name', themeName);
    this.model.set('description', themeDescription);
    this.model.set('analyticScript', themeAnalyticScript);
    this.model.set('minZoomLevel', themeMinimumZoom);
    this.model.set('maxZoomLevel', themeMaximumZoom);
    this.model.set('movementRadius', themeMovementRadius);
    this.model.updateModificationDate();

    window.history.pushState(
      {},
      themeName,
      ThemeCore.buildPath(this.model.get('fragment'), this.model.get('name'))
    );

    this.model.set('autoCenter', false);

    if (this.ui.themePositionSetNew.prop('checked') === true) {
      this.model.set('center', mapCenter);
      this.model.set('zoomLevel', mapZoomLevel);
    }

    if (this.ui.themePositionAutoCenter.prop('checked') === true) {
      this.model.set('autoCenter', true);
    }

    if (this.ui.themeInfoDisplayPopup.prop('checked') === true) {
      this.model.set('infoDisplay', CONST.infoDisplay.popup);
    } else if (this.ui.themeInfoDisplayModal.prop('checked') === true) {
      this.model.set('infoDisplay', CONST.infoDisplay.modal);
    } else if (this.ui.themeInfoDisplayColumn.prop('checked') === true) {
      this.model.set('infoDisplay', CONST.infoDisplay.column);
    }

    if (config.availableGeocoders.length > 1) {
      for (const geocoder in CONST.geocoder) {
        if ({}.hasOwnProperty.call(CONST.geocoder, geocoder)) {
          const ucFirstGeocoder = geocoder.ucfirst();

          if (
            this.ui[`themeGeocoder${ucFirstGeocoder}`].prop('checked') === true
          ) {
            this.model.set('geocoder', geocoder);
          }
        }
      }
    }

    if (this._userFavoriteThemes.has(this.model)) {
      this._userFavoriteThemes.setThemeData(this.model);

      this._radio.vent.trigger(
        'favorite:change',
        this._userFavoriteThemes.getCollection()
      );
    }

    this.model.save(
      {},
      {
        success: () => {
          if (
            this.model.get('infoDisplay') !== this._oldModel.get('infoDisplay')
          ) {
            if (this.model.get('infoDisplay') === CONST.infoDisplay.popup) {
              this._radio.commands.execute('map:bindAllPopups');
            } else {
              this._radio.commands.execute('map:unbindAllPopups');
            }
          }

          const currentZoom = map.getZoom();

          if (currentZoom < themeMinimumZoom) {
            map.setZoom(themeMinimumZoom, { animate: true });
          } else if (currentZoom > themeMaximumZoom) {
            map.setZoom(themeMaximumZoom, { animate: true });
          }

          if (themeMovementRadius) {
            MapUi.lockMovementFromCenterAndRadius(
              map,
              this.model.get('center').lat,
              this.model.get('center').lng,
              themeMovementRadius
            );
          } else {
            map.setMaxBounds(null);
          }

          this._oldModel = this.model.clone();

          this.close();
        },
        error: () => {
          // FIXME
          console.error('nok'); // eslint-disable-line
        }
      }
    );
  },

  onBeforeClose() {
    this._reset();
  },

  onReset() {
    this._reset();

    this.close();
  },

  _reset() {
    this.model.set('color', this._oldModel.get('color'));
    this._radio.commands.execute('ui:setTitleColor', this.model.get('color'));
  },

  onOverColorButtons(e) {
    this._radio.commands.execute('ui:setTitleColor', e.target.dataset.color);
  },

  onLeaveColorButtons() {
    this._radio.commands.execute('ui:setTitleColor', this.model.get('color'));
  },

  onClickColorButtons(e) {
    $('i', this.ui.colorButtons).removeClass('fa-check');

    e.target.querySelector('i').classList.add('fa-check');

    this.model.set('color', e.target.dataset.color);
  }
});

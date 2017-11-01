import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from 'ui/map';
import { basename, extensionname } from 'core/utils';
import CONST from 'const';
import template from 'templates/tempLayer/editGpxColumn.ejs';
import MarkedHelper from 'helper/marked';
import EditMarkerModal from 'view/admin/layer/editMarkerModal';

export default Marionette.ItemView.extend({
  template,

  behaviors() {
    return {
      l20n: {},
      column: {
        appendToBody: true,
        destroyOnClose: true,
        routeOnClose: this.options.routeOnClose,
        triggerRouteOnClose: this.options.triggerRouteOnClose
      }
    };
  },

  ui: {
    column: '.column',
    form: 'form',
    submitButton: '.submit_btn',

    layerName: '#layer_name',
    layerDescription: '#layer_description',
    layerCluster: '#layer_cluster',
    layerHeat: '#layer_heat',
    infoDisplayInfo: '.info_info_display_btn',
    layerPopupContent: '#layer_popup_content',
    layerFile: '#layer_file',

    heatOptions: '.heat-options',
    heatMapInfo: '.info_heat_map_btn',
    heatMinOpacity: '#layer_heat_min_opacity',
    heatMaxZoom: '#layer_heat_max_zoom',
    heatMax: '#layer_heat_max',
    heatBlur: '#layer_heat_blur',
    heatRadius: '#layer_heat_radius',

    markerOptions: '.marker-options',
    markerWrapper: '.marker-wrapper',
    editMarkerButton: '.edit_marker_btn',

    formGroups: '.form-group',
    fileFormGroup: '.form-group.layer_file',

    currentFile: '.current_file'
  },

  events: {
    'change @ui.layerCluster': 'onChangeLayerRepresentation',
    'change @ui.layerHeat': 'onChangeLayerRepresentation',
    'click @ui.editMarkerButton': 'onClickEditMarker',
    submit: 'onSubmit',
    reset: 'onReset'
  },

  templateHelpers() {
    return {
      marker: MapUi.buildLayerHtmlIcon(this.model)
    };
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');

    this._oldModel = this.model.clone();

    this.listenTo(this.model, 'change', this.updateMarkerIcon);
  },

  onRender() {
    if (this.model.get('fileUri')) {
      const fileUri = this.model.get('fileUri');
      const fileName = basename(fileUri || '');

      this.ui.currentFile
        .html(
          document.l10n.getSync('currentFile', {
            file: `<a href="${fileUri}" rel="noopener noreferrer" target="_blank">${fileName}</a>`
          })
        )
        .removeClass('hide');
    }

    if (this.model.get('rootLayerType') === CONST.rootLayerType.heat) {
      this.ui.layerHeat.prop('checked', true);
      this.hideMarkerOptions();
      this.showHeatOptions();
    } else {
      this.ui.layerCluster.prop('checked', true);
    }

    this.ui.heatMapInfo.popover({
      container: 'body',
      placement: 'left',
      trigger: 'focus',
      html: true,
      title: document.l10n.getSync('editLayerFormColumn_heatMapPopoverTitle'),
      content: MarkedHelper.render(
        document.l10n.getSync('editLayerFormColumn_heatMapPopoverContent')
      )
    });

    this.ui.infoDisplayInfo.popover({
      container: 'body',
      placement: 'left',
      trigger: 'focus',
      html: true,
      title: document.l10n.getSync(
        'editLayerFormColumn_infoDisplayPopoverTitle'
      ),
      content: MarkedHelper.render(
        document.l10n.getSync('editLayerFormColumn_infoDisplayPopoverContent')
      )
    });

    this.ui.layerFile.filestyle({
      icon: false,
      badge: false,
      buttonText: document.l10n.getSync('editLayerFormColumn_browse')
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

  onChangeLayerRepresentation() {
    if (this.ui.layerCluster.prop('checked')) {
      this.hideHeatOptions();
      this.showMarkerOptions();
    } else {
      this.hideMarkerOptions();
      this.showHeatOptions();
    }
  },

  showHeatOptions() {
    this.ui.heatOptions.removeClass('hide');
  },

  hideHeatOptions() {
    this.ui.heatOptions.addClass('hide');
  },

  showMarkerOptions() {
    this.ui.markerOptions.removeClass('hide');
  },

  hideMarkerOptions() {
    this.ui.markerOptions.addClass('hide');
  },

  updateMarkerIcon() {
    const html = MapUi.buildLayerHtmlIcon(this.model);

    this.ui.markerWrapper.html(html);
  },

  onClickEditMarker() {
    new EditMarkerModal({
      model: this.model
    }).open();
  },

  enableSubmitButton() {
    this.ui.submitButton.prop('disabled', false);
  },

  disableSubmitButton() {
    this.ui.submitButton.prop('disabled', true);
  },

  onSubmit(e) {
    e.preventDefault();

    this.disableSubmitButton();

    this.ui.formGroups.removeClass('has-feedback has-error');

    const fileName = this.ui.layerFile.val();

    if (!fileName && this.options.isNew) {
      this.ui.fileFormGroup.addClass('has-feedback has-error');
      this.enableSubmitButton();
      return false;
    } else if (fileName) {
      const extension = extensionname(fileName).toLowerCase();

      if (extension !== 'gpx') {
        this.ui.fileFormGroup.addClass('has-feedback has-error');
        this.enableSubmitButton();
        return false;
      }
    }

    this.model.set('minZoom', 0);
    this.model.set('name', this.ui.layerName.val());
    this.model.set('description', this.ui.layerDescription.val());
    this.model.set('popupContent', this.ui.layerPopupContent.val());
    this.model.set('heatMinOpacity', parseFloat(this.ui.heatMinOpacity.val()));
    this.model.set('heatMaxZoom', parseInt(this.ui.heatMaxZoom.val(), 10));
    this.model.set('heatMax', parseFloat(this.ui.heatMax.val()));
    this.model.set('heatBlur', parseInt(this.ui.heatBlur.val(), 10));
    this.model.set('heatRadius', parseInt(this.ui.heatRadius.val(), 10));

    if (this.ui.layerCluster.prop('checked')) {
      this.model.set('rootLayerType', CONST.rootLayerType.markerCluster);
    } else {
      this.model.set('rootLayerType', CONST.rootLayerType.heat);
    }

    if (this.options.isNew) {
      this.collection.add(this.model);
    } else {
      MapUi.updateLayerStyleFromOlderModel(this.model, this._oldModel);
    }

    if (fileName) {
      if (!this.options.isNew) {
        this._radio.commands.execute('map:removeLayer', this.model);
      }

      const reader = new FileReader();

      reader.onload = () => {
        const fileContent = reader.result;
        this._radio.commands.execute(
          'map:addTempLayer',
          this.model,
          fileContent
        );
      };

      reader.readAsText(this.ui.layerFile.get(0).files[0]);
    }

    this.close();

    return true;
  },

  onReset() {
    this.model.set(this._oldModel.toJSON());

    this.ui.column.one('transitionend', this.render);

    this.close();
  }
});

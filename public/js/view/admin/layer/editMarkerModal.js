import $ from 'jquery';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import colorConvert from 'color-convert';
import 'reinvented-color-wheel/css/reinvented-color-wheel.min.css';
import ReinventedColorWheel from 'reinvented-color-wheel';

import CONST from 'const';
import template from 'templates/admin/layer/editMarkerModal.ejs';

export default Marionette.ItemView.extend({
  template,

  behaviors() {
    return {
      l20n: {},
      modal: {
        appendToBody: true,
        destroyOnClose: true
      }
    };
  },

  ui: {
    modal: '.pop_modal',
    colorButtons: '.color-buttons .btn',
    customColorWheel: '#customColorWheel',
    customColorHexa: '.custom-color-hexa',
    shapeButtons: '.shape-buttons .btn',
    iconTypeTabs: '.marker_icon_type_tab',
    iconTypeLibraryTab: '#iconTypeLibraryTab',
    iconTypeLibraryForm: '.form-library',
    iconTypeExternalTab: '#iconTypeExternalTab',
    iconTypeExternalForm: '.form-external',
    iconNameInput: '#markerIconName',
    iconUrlInput: '#markerIconUrl',
    iconPreview: '.icon-preview',
    closeButton: '.close_btn'
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
    'keyup @ui.customColorHexa': 'onKeyUpHexaColor',
    'blur @ui.customColorHexa': 'onBlurHexaColor',

    submit: 'onSubmit',
    reset: 'onReset'
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');

    this._oldModel = this.model.clone();
  },

  templateHelpers() {
    const markerColor = this.model.get('markerColor');
    let customColorHexaValue = '';

    if (typeof markerColor !== 'string') {
      const { h, s, l } = markerColor;
      const hexaColor = colorConvert.hsl.hex(h, s, l);
      customColorHexaValue = `#${hexaColor}`;
    }

    return {
      customColorHexaValue
    };
  },

  onRender() {
    const markerColor = this.model.get('markerColor');
    const markerShape = this.model.get('markerShape');
    let initialColorWheelValues = [0, 50, 50];

    if (typeof markerColor === 'string') {
      this.ui.colorButtons
        .filter(`.${markerColor}`)
        .find('i')
        .addClass('fa-check');
    } else {
      const { h, s, l } = markerColor;
      initialColorWheelValues = [h, s, l];
    }

    this.ui.shapeButtons.filter(`.${markerShape}`).addClass('active');

    this.ui.iconTypeTabs.removeClass('active');

    switch (this.model.get('markerIconType')) {
      case CONST.map.markerIconType.external:
        this.ui.iconTypeExternalTab.addClass('active').click();
        break;

      default:
      case CONST.map.markerIconType.library:
        this.ui.iconTypeLibraryTab.addClass('active').click();
    }

    this.updateIconPreview();

    setTimeout(() => {
      this._customColorWheel = new ReinventedColorWheel({
        appendTo: this.ui.customColorWheel[0],
        hsl: initialColorWheelValues,
        wheelDiameter: 140,
        wheelThickness: 15,
        wheelReflectsSaturation: false,
        onChange: instance => {
          $('i', this.ui.colorButtons).removeClass('fa-check');

          const color = {
            h: instance.hsl[0],
            s: instance.hsl[1],
            l: instance.hsl[2]
          };

          const hexaColor = colorConvert.hsl.hex(color.h, color.s, color.l);
          this.ui.customColorHexa.val(`#${hexaColor}`);

          this.model.set('markerColor', color);
        }
      });
    }, 0);
  },

  open() {
    this.triggerMethod('open');
    return this;
  },

  close() {
    this.triggerMethod('close');
    return this;
  },

  onReset() {
    this.model.set(this._oldModel.toJSON());

    this.close();
  },

  onSubmit(e) {
    e.preventDefault();

    this.close();
  },

  onClickColorButtons(e) {
    $('i', this.ui.colorButtons).removeClass('fa-check');

    e.currentTarget.querySelector('i').classList.add('fa-check');

    this.ui.customColorHexa.val('');

    this.model.set('markerColor', e.currentTarget.dataset.color);
  },

  onClickShapeButtons(e) {
    this.ui.shapeButtons.removeClass('active');

    e.currentTarget.classList.add('active');

    this.model.set('markerShape', e.currentTarget.dataset.shape);
  },

  onChangeIconName() {
    this.updateIconPreview();
  },

  onChangeIconUrl(e) {
    this.model.set('markerIconUrl', e.currentTarget.value);
  },

  updateIconPreview() {
    const iconName = this.ui.iconNameInput.val();

    this.ui.iconPreview.attr('class', `icon-preview fa fa-${iconName}`);

    this.model.set('markerIcon', iconName);
  },

  onClickIconTypeLibraryTab() {
    this.ui.iconTypeExternalForm.addClass('hide');
    this.ui.iconTypeLibraryForm.removeClass('hide');

    this.model.set('markerIconType', CONST.map.markerIconType.library);
  },

  onClickIconTypeExternalTab() {
    this.ui.iconTypeLibraryForm.addClass('hide');
    this.ui.iconTypeExternalForm.removeClass('hide');

    this.model.set('markerIconType', CONST.map.markerIconType.external);
  },

  onKeyUpHexaColor() {
    const hexaColor = this.ui.customColorHexa.val();

    if (/^#?[a-zA-Z0-9]{6}$/.test(hexaColor)) {
      this._customColorWheel.hex = `#${hexaColor.replace(/#/g, '')}`;
    }
  },

  onBlurHexaColor() {
    const hexaColor = this.ui.customColorHexa.val();
    this._customColorWheel.hex = `#${hexaColor.replace(/#/g, '')}`;
  }
});

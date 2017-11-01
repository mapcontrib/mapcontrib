import $ from 'jquery';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
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

    submit: 'onSubmit',
    reset: 'onReset'
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');

    this._oldModel = this.model.clone();
  },

  onRender() {
    const markerColor = this.model.get('markerColor');
    const markerShape = this.model.get('markerShape');

    this.ui.colorButtons
      .filter(`.${markerColor}`)
      .find('i')
      .addClass('fa-check');

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
  }
});

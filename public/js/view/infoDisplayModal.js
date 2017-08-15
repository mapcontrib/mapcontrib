import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/infoDisplayModal.ejs';
import CONST from 'const';

export default Marionette.LayoutView.extend({
  template,

  behaviors: {
    l20n: {},
    modal: {
      appendToBody: true
    }
  },

  ui: {
    modal: '.info_display_modal',
    content: '.info_content',
    editBtn: '.edit_btn',
    footer: '.bordered-footer'
  },

  events: {
    'click @ui.editBtn': '_onClickEdit'
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');
  },

  templateHelpers() {
    return {
      editRoute: this.options.editRoute
    };
  },

  onRender() {
    const layerModel = this.options.layerModel;

    this.ui.content.append(this.options.content);

    if (
      this.options.isLogged &&
      layerModel.get('type') === CONST.layerType.overpass
    ) {
      this.ui.footer.removeClass('hide');
    }
  },

  open() {
    this.triggerMethod('open');
    return this;
  },

  close() {
    this.triggerMethod('close');
    return this;
  },

  onBeforeOpen() {
    this._radio.vent.trigger('column:closeAll', [this.cid]);
    this._radio.vent.trigger('widget:closeAll', [this.cid]);
  },

  _onClickEdit() {
    this._radio.commands.execute('set:edition-data', {
      layer: this.options.layer,
      layerModel: this.options.layerModel
    });
    this.close();
  }
});

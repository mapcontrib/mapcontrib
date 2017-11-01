import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/admin/locale/layerEditColumn.ejs';
import MarkedHelper from 'helper/marked';

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
    submitButton: '.submit_btn',

    layerName: '#layer_name',
    layerDescription: '#layer_description',
    layerPopupContent: '#layer_popup_content',
    infoDisplayInfo: '.info_info_display_btn'
  },

  events: {
    submit: 'onSubmit',
    reset: 'onReset'
  },

  templateHelpers() {
    const attributes = this.model.get('locales')[this.options.locale];

    return {
      name: attributes ? attributes.name : '',
      description: attributes ? attributes.description : '',
      popupContent: attributes ? attributes.popupContent : ''
    };
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');
  },

  onBeforeOpen() {
    this._radio.vent.trigger('column:closeAll', [this.cid]);
    this._radio.vent.trigger('widget:closeAll', [this.cid]);
  },

  onRender() {
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
  },

  open() {
    this.triggerMethod('open');
    return this;
  },

  close() {
    this.triggerMethod('close');
    return this;
  },

  enableSubmitButton() {
    this.ui.submitButton.prop('disabled', false);
  },

  disableSubmitButton() {
    this.ui.submitButton.prop('disabled', true);
  },

  onSubmit(e) {
    e.preventDefault();

    const locales = this.model.get('locales');

    locales[this.options.locale] = {
      name: this.ui.layerName.val(),
      description: this.ui.layerDescription.val(),
      popupContent: this.ui.layerPopupContent.val()
    };

    this.model.set('locales', locales);

    this.model.updateModificationDate();
    this.options.theme.updateModificationDate();

    this.options.theme.save(
      {},
      {
        success: () => {
          this.close();
        },
        error: () => {
          // FIXME
          console.error('nok');
          this.enableSubmitButton();
        }
      }
    );
  },

  onReset() {
    this.close();
  }
});

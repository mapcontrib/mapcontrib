import Marionette from 'backbone.marionette';
import template from './template.ejs';

export default Marionette.ItemView.extend({
  template,

  behaviors() {
    return {
      l20n: {}
    };
  },

  ui: {
    yesRadio: '.yes_radio',
    noRadio: '.no_radio',
    removeBtn: '.remove_btn'
  },

  events: {
    'change @ui.yesRadio': 'updateRadio',
    'change @ui.noRadio': 'updateRadio',
    'click @ui.removeBtn': 'onClickRemoveBtn'
  },

  templateHelpers() {
    const placeholder =
      this.options.placeholder || document.l10n.getSync('value');

    return {
      placeholder,
      cid: this.model.cid
    };
  },

  initialize() {
    const value = this.model.get('value');

    if (['yes', 'no', ''].indexOf(value) === -1) {
      this.model.set('value', '');
    }
  },

  onRender() {
    switch (this.model.get('value')) {
      case 'yes':
        this.ui.yesRadio.prop('checked', true);
        break;
      case 'no':
        this.ui.noRadio.prop('checked', true);
        break;
      default:
    }
  },

  updateRadio() {
    if (this.ui.yesRadio.prop('checked') === true) {
      this.model.set('value', 'yes');
    } else if (this.ui.noRadio.prop('checked') === true) {
      this.model.set('value', 'no');
    } else {
      this.model.set('value', '');
    }
  },

  onClickRemoveBtn() {
    this.model.destroy();
  },

  enable() {
    this.ui.yesRadio.prop('disabled', false);
    this.ui.noRadio.prop('disabled', false);
  },

  disable() {
    this.ui.yesRadio.prop('disabled', true);
    this.ui.noRadio.prop('disabled', true);
  },

  enableRemoveBtn() {
    this.ui.removeBtn.prop('disabled', false);
  },

  disableRemoveBtn() {
    this.ui.removeBtn.prop('disabled', true);
  }
});

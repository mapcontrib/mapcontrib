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
    yesCheckbox: '.yes_checkbox',
    removeBtn: '.remove_btn'
  },

  events: {
    'change @ui.yesCheckbox': 'updateCheckbox',
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

    if (['yes', ''].indexOf(value) === -1) {
      this.model.set('value', '');
    }
  },

  onRender() {
    switch (this.model.get('value')) {
      case 'yes':
        this.ui.yesCheckbox.prop('checked', true);
        break;
      default:
    }
  },

  updateCheckbox() {
    if (this.ui.yesCheckbox.prop('checked') === true) {
      this.model.set('value', 'yes');
    } else {
      this.model.set('value', '');
    }
  },

  onClickRemoveBtn() {
    this.model.destroy();
  },

  enable() {
    this.ui.yesCheckbox.prop('disabled', false);
  },

  disable() {
    this.ui.yesCheckbox.prop('disabled', true);
  },

  enableRemoveBtn() {
    this.ui.removeBtn.prop('disabled', false);
  },

  disableRemoveBtn() {
    this.ui.removeBtn.prop('disabled', true);
  }
});

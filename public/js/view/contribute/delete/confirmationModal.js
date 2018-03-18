import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/contribute/delete/confirmationModal.ejs';

export default Marionette.LayoutView.extend({
  template,

  behaviors() {
    return {
      l20n: {},
      modal: {
        appendToBody: true,
        routeOnClose: this.options.routeOnClose
      }
    };
  },

  ui: {
    modal: '#delete_confirmation_modal',
    confirmationBtn: '#confirmationBtn',
    cancelBtn: '#cancelBtn'
  },

  events: {
    'click @ui.confirmationBtn': 'onClickConfirmation',
    'click @ui.cancelBtn': 'onClickCancel'
  },

  templateHelpers() {
    const aboutTextVersion = 'sdfjg';
    // const aboutTextVersion = document.l10n.getSync('aboutTextVersion', {
    //   version: this.options.version
    // });

    return {
      aboutTextVersion
    };
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');
  },

  open() {
    this.triggerMethod('open');
    return this;
  },

  close() {
    this.triggerMethod('close');
    return this;
  },

  onClickCancel() {
    this.close();
  },

  onClickConfirmation() {}
});

import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/overPassErrorNotification.ejs';
import Locale from 'core/locale';

export default Marionette.ItemView.extend({
  template,

  behaviors: {
    l20n: {},
    notification: {
      destroyOnClose: true
    }
  },

  ui: {
    notification: '.notification',

    content: '.content',
    error: '.error'
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');

    return this.render();
  },

  open() {
    this.triggerMethod('open');
    return this;
  },

  close() {
    this.triggerMethod('close');
    return this;
  },

  onRender() {
    this.ui.content.html(
      document.l10n.getSync('overpassErrorNotification_content', {
        name: Locale.getLocalized(this.model, 'name')
      })
    );

    this.ui.error.html(`«&nbsp;${this.options.error}&nbsp;»`);
  }
});

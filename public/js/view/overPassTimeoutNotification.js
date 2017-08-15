import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/overPassTimeoutNotification.ejs';
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

    content: '.content'
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
      document.l10n.getSync('overpassTimeoutNotification_content', {
        name: Locale.getLocalized(this.model, 'name')
      })
    );
  }
});

import Marionette from 'backbone.marionette';
import template from './empty.ejs';

export default Marionette.ItemView.extend({
  template,

  templateHelpers() {
    return {
      placeholder: this.options.placeholder
    };
  }
});

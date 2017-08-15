import Marionette from 'backbone.marionette';
import template from './template.ejs';

export default Marionette.LayoutView.extend({
  template,

  tagName: 'select',
  className: 'form-control',

  events: {
    change: '_onChange'
  },

  behaviors() {
    return {
      l20n: {}
    };
  },

  onRender() {
    if (this.options.value) {
      this.$el.val(this.options.value);
    }
  },

  getValue() {
    return this.$el.val();
  },

  _onChange() {
    this.trigger('change', this.$el.val());
  }
});

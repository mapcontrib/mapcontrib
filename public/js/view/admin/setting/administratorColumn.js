import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/admin/setting/administrator/administratorColumn.ejs';
// import templateListItem from 'templates/admin/setting/administrator/listItem.ejs';

export default Marionette.LayoutView.extend({
  template,
  // templateListItem,

  behaviors() {
    return {
      l20n: {},
      column: {
        appendToBody: true,
        destroyOnClose: true,
        routeOnClose: this.options.previousRoute
      }
    };
  },

  ui: {
    column: '.column',
    administratorList: '.administrator_list'
  },

  initialize() {
    this._app = this.options.app;
    this._radio = Wreqr.radio.channel('global');
  },

  onBeforeOpen() {
    this._radio.vent.trigger('column:closeAll', [this.cid]);
    this._radio.vent.trigger('widget:closeAll', [this.cid]);
  },

  open() {
    this.triggerMethod('open');
    return this;
  },

  close() {
    this.triggerMethod('close');
    return this;
  },

  onRender() {}
});

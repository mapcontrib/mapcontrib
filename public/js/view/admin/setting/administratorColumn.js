import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import ListGroup from 'ui/listGroup';
import template from 'templates/admin/setting/administrator/administratorColumn.ejs';

export default Marionette.LayoutView.extend({
  template,

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

  regions: {
    list: '.rg_list'
  },

  ui: {
    column: '.column'
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');
  },

  onRender() {
    const listGroup = new ListGroup({
      collection: [],
      labelAttribute: 'key',
      reorderable: false,
      removeable: true,
      navigable: false,
      placeholder: document.l10n.getSync('uiListGroup_placeholder')
    });

    this.listenTo(listGroup, 'item:remove', this._onRemove);

    this.getRegion('list').show(listGroup);
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

  _onRemove(model, e) {
    e.preventDefault();

    model.destroy();
    this.model.save();
  }
});

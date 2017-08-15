import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/admin/setting/cacheArchive/archiveColumn.ejs';
import MapUi from 'ui/map';
import NavPillsStackedListView from 'ui/navPillsStacked';

export default Marionette.LayoutView.extend({
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
    emptyState: '.empty_state'
  },

  regions: {
    list: '.rg_list'
  },

  initialize() {
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

  onRender() {
    const items = this._buildItems();

    if (items.length > 0) {
      this.ui.emptyState.hide();
    }

    const navPillsStackedList = new NavPillsStackedListView({ items });
    this.getRegion('list').show(navPillsStackedList);
  },

  _buildItems() {
    const items = [];
    const layers = this.model.get('layers').models;

    for (const layerModel of layers) {
      const uuid = layerModel.get('uuid');
      const deletedFeatures = layerModel.getArchivedDeletedPois();
      const rightIcon = MapUi.buildLayerHtmlIcon(layerModel);

      for (const feature of deletedFeatures) {
        items.push({
          label: feature.properties.tags.name || feature.id,
          rightIcon,
          href: `#admin/setting/cache-archive/${uuid}/${feature.id}`
        });
      }
    }

    return items;
  }
});

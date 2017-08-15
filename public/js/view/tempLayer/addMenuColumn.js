import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/tempLayer/addMenuColumn.ejs';

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
    overPassItem: '.overpass_item',
    gpxItem: '.gpx_item',
    csvItem: '.csv_item',
    geoJsonItem: '.geojson_item'
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');
  },

  onRender() {
    if (!File || !FileList || !FileReader) {
      this.ui.gpxItem.addClass('hide');
      this.ui.csvItem.addClass('hide');
      this.ui.geoJsonItem.addClass('hide');
    }
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
  }
});

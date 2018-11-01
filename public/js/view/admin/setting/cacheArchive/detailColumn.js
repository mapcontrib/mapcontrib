import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/admin/setting/cacheArchive/detailColumn.ejs';
import MapUi from 'ui/map';

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
    tableBody: 'table tbody',
    zoomBtn: '.zoom_btn',
    archiveBtn: '.archive_btn',
    deleteBtn: '.delete_btn'
  },

  events: {
    'click @ui.zoomBtn': '_onClickZoom',
    'click @ui.archiveBtn': '_onClickArchive',
    'click @ui.deleteBtn': '_onClickDelete'
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');
  },

  templateHelpers() {
    return {
      osmId: this.options.deletedFeature.id
    };
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
    const isArchived = this.options.deletedFeature.isArchived;
    const tags = this.options.deletedFeature.properties.tags;
    let html = '';

    for (const key in tags) {
      if ({}.hasOwnProperty.call(tags, key)) {
        html += `<tr><td>${key}</td><td>${tags[key]}</td></tr>`;
      }
    }

    this.ui.tableBody.html(html);

    if (isArchived) {
      this.ui.archiveBtn.hide();
      this.ui.deleteBtn.addClass('btn-block');
    }
  },

  _onClickZoom() {
    if (
      this.options.deletedFeature.geometry &&
      this.options.deletedFeature.geometry.coordinates
    ) {
      const bounds = MapUi.buildBoundsFromCoordinates(
        this.options.deletedFeature.geometry.coordinates
      );
      this._radio.commands.execute('map:fitBounds', bounds);
    }
  },

  _onClickArchive() {
    const features = this.model.get('cacheDeletedFeatures').map(feature => {
      if (feature.id === this.options.deletedFeature.id) {
        feature.isArchived = true;
      }

      return feature;
    });

    this.model.set('cacheDeletedFeatures', features);
    this.options.theme.save();
    this.close();
  },

  _onClickDelete() {
    const features = this.model
      .get('cacheDeletedFeatures')
      .filter(feature => feature.id !== this.options.deletedFeature.id);

    this.model.set('cacheDeletedFeatures', features);
    this.options.theme.save();
    this.close();
  }
});

import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import { h, render } from 'preact';
import template from 'templates/admin/setting/cacheModification/detailColumn.ejs';
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
    preact: '#preact',
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

  async onRender() {
    const layerName = this.model.get('name');
    const osmId = this.options.modifiedFeature.id;
    const { cachedFeature, modifiedFeature } = this.options;

    const diffObject = {
      timestamp: {
        cached: new Date(
          cachedFeature.properties.meta.timestamp
        ).toLocaleString(),
        modified: new Date(
          modifiedFeature.properties.meta.timestamp
        ).toLocaleString(),
        isDifferent:
          modifiedFeature.properties.meta.timestamp !==
          cachedFeature.properties.meta.timestamp
      },
      version: {
        cached: cachedFeature.properties.meta.version,
        modified: modifiedFeature.properties.meta.version,
        isDifferent:
          modifiedFeature.properties.meta.version !==
          cachedFeature.properties.meta.version
      },
      tags: {}
    };

    Object.keys(cachedFeature.properties.tags).forEach(key => {
      diffObject.tags[key] = {
        cached: cachedFeature.properties.tags[key],
        modified: modifiedFeature.properties.tags[key],
        isDifferent:
          modifiedFeature.properties.tags[key] !==
          cachedFeature.properties.tags[key]
      };
    });

    Object.keys(modifiedFeature.properties.tags).forEach(key => {
      diffObject.tags[key] = {
        cached: cachedFeature.properties.tags[key],
        modified: modifiedFeature.properties.tags[key],
        isDifferent:
          modifiedFeature.properties.tags[key] !==
          cachedFeature.properties.tags[key]
      };
    });

    render(
      <form>
        <div class="container-fluid content sticky">
          <div class="row sticky-header">
            <div class="col-xs-12">
              <button type="button" class="btn btn-primary btn-block zoom_btn">
                {document.l10n.getSync(
                  'overPassCacheModifications_zoomOnElement'
                )}
              </button>
            </div>
          </div>

          <div class="row sticky-inner">
            <div class="col-xs-12">
              <h4>{document.l10n.getSync('layer')}</h4>
              <p class="append-xs-2">{layerName}</p>

              <h4>{document.l10n.getSync('osmId')}</h4>
              <p class="append-xs-2">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.openstreetmap.org/${osmId}`}
                >
                  {osmId}
                </a>{' '}
                (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`http://osmlab.github.io/osm-deep-history/#/${osmId}`}
                >
                  OSM Deep History
                </a>
                )
              </p>

              <h4>
                {document.l10n.getSync('overPassCacheModifications_dates')}
              </h4>
              <p>
                {document.l10n.getSync('overPassCacheModifications_cacheDate')}:{' '}
                {diffObject.timestamp.cached}
              </p>
              <p class="append-xs-2">
                {document.l10n.getSync(
                  'overPassCacheModifications_modificationDate'
                )}
                : {diffObject.timestamp.modified}
              </p>

              <h4>{document.l10n.getSync('tags')}</h4>
              {Object.keys(diffObject.tags).map(key => (
                <div>
                  <div>
                    Cached: {key}: {diffObject.tags[key].cached}
                  </div>
                  <div>
                    Modified: {key}: {diffObject.tags[key].modified}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div class="row sticky-footer">
            <div class="col-xs-12">
              <button type="button" class="btn btn-primary archive_btn">
                {document.l10n.getSync('archive')}
              </button>
              <button
                type="button"
                class="btn btn-primary pull-right delete_btn"
              >
                {document.l10n.getSync('delete')}
              </button>
            </div>
          </div>
        </div>
      </form>,
      this.ui.preact[0]
    );
  },

  _onClickZoom() {
    if (
      this.options.modifiedFeature.geometry &&
      this.options.modifiedFeature.geometry.coordinates
    ) {
      const bounds = MapUi.buildBoundsFromCoordinates(
        this.options.modifiedFeature.geometry.coordinates
      );
      this._radio.commands.execute('map:fitBounds', bounds);
    }
  },

  _onClickArchive() {
    const fragment = this.options.theme.get('fragment');
    this.model.archiveFeature(fragment, this.options.modifiedFeature);
    this.close();
  },

  _onClickDelete() {
    const fragment = this.options.theme.get('fragment');
    this.model.deleteFeature(fragment, this.options.modifiedFeature);
    this.close();
  }
});

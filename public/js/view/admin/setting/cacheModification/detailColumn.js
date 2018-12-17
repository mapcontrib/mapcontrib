import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import { h, render } from 'preact';

import CONST from 'const';
import ThemeCore from 'core/theme';
import template from 'templates/admin/setting/cacheModification/detailColumn.ejs';
import MapUi from 'ui/map';
import TagForm from './tagForm';

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
    zoomBtn: '.zoom_btn'
  },

  events: {
    'click @ui.zoomBtn': '_onClickZoom'
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');
    this._config = this.options.config;
    this._user = this.options.user;
    this._theme = this.options.theme;
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
    const fragment = this._theme.get('fragment');
    const themeName = this._theme.get('name');
    const osmId = this.options.modifiedFeature.id;
    const { cachedFeature, modifiedFeature } = this.options;
    const createdBy = CONST.osm.changesetCreatedBy.replace(
      '{version}',
      MAPCONTRIB.version
    );
    const changesetAttribution = this._radio.reqres.request(
      'changeset-attribution'
    );
    let changesetComment = CONST.osm.changesetComment.replace(
      '{url}',
      ThemeCore.buildUrl(window, fragment, themeName)
    );

    if (changesetAttribution) {
      changesetComment += `\n\nTiles: ${changesetAttribution}`;
    }

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
      <TagForm
        oauthEndPoint={this._config.oauthEndPoint}
        oauthConsumerKey={this._config.oauthConsumerKey}
        oauthSecret={this._config.oauthSecret}
        l10n={document.l10n}
        fragment={fragment}
        themeName={themeName}
        feature={this.options.modifiedFeature}
        layer={this.model}
        user={this._user}
        osmId={osmId}
        createdBy={createdBy}
        changesetComment={changesetComment}
        diffObject={diffObject}
        close={() => this.close()}
      />,
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
  }
});

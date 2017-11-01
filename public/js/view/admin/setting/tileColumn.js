import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/admin/setting/tile/tileColumn.ejs';
import templateListItem from 'templates/admin/setting/tile/listItem.ejs';

export default Marionette.LayoutView.extend({
  template,
  templateListItem,

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
    tileList: '.tile_list',
    tiles: '.tile_list input'
  },

  events: {
    submit: 'onSubmit',
    reset: 'onReset'
  },

  initialize() {
    this._app = this.options.app;
    this._radio = Wreqr.radio.channel('global');

    this._oldModel = this.model.clone();
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
    let tile;
    let html = '';
    let maxZoom = '';
    const tiles = this.model.get('tiles');
    const appTiles = this._app.getTiles();

    for (const id in appTiles) {
      if ({}.hasOwnProperty.call(appTiles, id)) {
        tile = appTiles[id];

        if (!tile) {
          continue;
        }

        let thumbnailHtml = '';

        for (let urlTemplate of tile.urlTemplate) {
          urlTemplate = urlTemplate
            .replace(/\{s\}/g, 'a')
            .replace(/\{z\}/g, '9')
            .replace(/\{y\}/g, '181');

          const urlTemplate1 = urlTemplate.replace(/\{x\}/g, '265');
          const urlTemplate2 = urlTemplate.replace(/\{x\}/g, '266');

          thumbnailHtml += `<img class="tile_1" src="${urlTemplate1}" alt="" />`;
          thumbnailHtml += `<img class="tile_2" src="${urlTemplate2}" alt="" />`;
        }

        maxZoom = document.l10n.getSync('editTileColumn_maxZoom', {
          maxZoom: tile.maxZoom
        });

        html += this.templateListItem({
          name: tile.name,
          maxZoom,
          id,
          thumbnailHtml,
          checked: tiles.indexOf(id) > -1 ? ' checked' : ''
        });
      }
    }

    this.ui.tileList.html(html);

    this.bindUIElements();
  },

  onSubmit(e) {
    e.preventDefault();

    let tiles = [];

    this.ui.tiles.each((i, tileInput) => {
      if (tileInput.checked) {
        tiles.push(tileInput.value);
      }
    });

    if (tiles.length === 0) {
      tiles = ['osm'];
    }

    this.model.set('tiles', tiles);
    this.model.updateModificationDate();

    this.model.save(
      {},
      {
        success: () => {
          this._oldModel = this.model.clone();

          this.close();
        },
        error: () => {
          // FIXME
          console.error('nok');
        }
      }
    );
  },

  onReset() {
    this.model.set(this._oldModel.toJSON());

    this.ui.column.one('transitionend', this.render);

    this.close();
  }
});

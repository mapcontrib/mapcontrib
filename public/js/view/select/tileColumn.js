
import _ from 'underscore';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import CONST from 'const';
import template from 'templates/select/tile/tileColumn.ejs';
import templateListItem from 'templates/select/tile/item.ejs';


export default Marionette.LayoutView.extend({
    template,
    templateListItem: templateListItem,

    behaviors() {
        return {
            l20n: {},
            column: {
                appendToBody: true,
                destroyOnClose: true,
                routeOnClose: this.options.previousRoute,
            },
        };
    },

    ui: {
        column: '.column',
        tileList: '.tile_list',
        tiles: '.tile_list input',
    },

    events: {
        'click @ui.tiles': 'onClickTiles',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this._fragment = this._radio.reqres.request('theme:fragment');
        const storage = JSON.parse( localStorage.getItem(`mapState-${this._fragment}`) ) || {};

        if ( storage.selectedTile ) {
            this._selectedInStorage = storage.selectedTile;
        }

        this.listenTo(this.model, 'change:tiles', this.onChangeModelTiles);
    },

    onRender() {
        let tile, checked;
        let html = '';
        const tiles = this.model.get('tiles');

        tiles.forEach((id) => {
            tile = CONST.map.tiles[id];

            if (!tile) {
                return;
            }

            let thumbnailHtml = '';

            for (let urlTemplate of tile.urlTemplate) {
                thumbnailHtml += `<img src="${urlTemplate}" alt="" />`;
            }

            thumbnailHtml = thumbnailHtml.replace(/\{s\}/g, 'a');
            thumbnailHtml = thumbnailHtml.replace(/\{z\}/g, '9');
            thumbnailHtml = thumbnailHtml.replace(/\{x\}/g, '265');
            thumbnailHtml = thumbnailHtml.replace(/\{y\}/g, '181');

            if ( this._selectedInStorage && this._selectedInStorage === id ) {
                checked = ' checked';
            }
            else if (id === tiles[0]) {
                checked = ' checked';
            }
            else {
                checked = '';
            }

            html += this.templateListItem({
                name: tile.name,
                id: id,
                thumbnailHtml: thumbnailHtml,
                checked: checked,
            });
        });

        this.ui.tileList.html( html );

        this.bindUIElements();
    },

    onClickTiles(e) {
        let newState;
        const key = `mapState-${this._fragment}`;
        const oldState = JSON.parse( localStorage.getItem( key ) );

        newState = {
            ...oldState,
            ...{ selectedTile: e.target.value }
        };

        localStorage.setItem( key, JSON.stringify( newState ) );

        this._radio.commands.execute('map:setTileLayer', e.target.value);
    },

    onChangeModelTiles() {
        this.render();
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },
});

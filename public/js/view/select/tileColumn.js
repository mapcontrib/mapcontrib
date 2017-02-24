
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import CONST from 'const';
import template from 'templates/select/tile/tileColumn.ejs';
import templateListItem from 'templates/select/tile/item.ejs';


export default Marionette.LayoutView.extend({
    template,
    templateListItem,

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
        displayMore: '.display_more',
    },

    events: {
        'click @ui.tiles': 'onClickTiles',
        'click @ui.displayMore': 'onClickdisplayMore',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this.listenTo(this.model, 'change:tiles', this.onChangeModelTiles);

        this._radio.vent.on('theme:rendered', this.onRender.bind(this));

        this._moreTilesDisplayed = false;
    },

    onRender() {
        let tile;
        let checked;
        let html = '';
        const tiles = this.model.get('tiles');

        if (this._moreTilesDisplayed) {
            this.ui.displayMore.addClass('hide');

            const supplementalTiles = Object.keys(CONST.map.tiles)
                .filter(tile => tiles.indexOf(tile) === -1);

            tiles.push(...supplementalTiles);
        }

        const allTilesCount = Object.keys(CONST.map.tiles).length;
        if (tiles.length !== allTilesCount) {
            this.ui.displayMore.removeClass('hide');
        }

        this._fragment = this._radio.reqres.request('theme:fragment');
        const storage = JSON.parse( localStorage.getItem(`mapState-${this._fragment}`) ) || {};

        if ( storage.selectedTile ) {
            this._selectedInStorage = storage.selectedTile;
        }

        tiles.forEach((id) => {
            tile = CONST.map.tiles[id];

            if (!tile) {
                return;
            }

            let thumbnailHtml = '';

            for (let urlTemplate of tile.urlTemplate) {
                urlTemplate = urlTemplate.replace(/\{s\}/g, 'a')
                    .replace(/\{z\}/g, '9')
                    .replace(/\{y\}/g, '181');

                const urlTemplate1 = urlTemplate.replace(/\{x\}/g, '265');
                const urlTemplate2 = urlTemplate.replace(/\{x\}/g, '266');

                thumbnailHtml += `<img class="tile_1" src="${urlTemplate1}" alt="" />`;
                thumbnailHtml += `<img class="tile_2" src="${urlTemplate2}" alt="" />`;
            }

            if ( this._selectedInStorage && this._selectedInStorage === id ) {
                checked = ' checked';
            }
            else {
                checked = '';
            }

            html += this.templateListItem({
                name: tile.name,
                id,
                thumbnailHtml,
                checked,
            });
        });

        this.ui.tileList.html( html );

        this.bindUIElements();
    },

    onClickTiles(e) {
        const key = `mapState-${this._fragment}`;
        const oldState = JSON.parse( localStorage.getItem( key ) );
        const newState = {
            ...oldState,
            ...{ selectedTile: e.target.value },
        };

        localStorage.setItem( key, JSON.stringify( newState ) );

        this._radio.commands.execute('map:setTileLayer', e.target.value);
    },

    onClickdisplayMore() {
        this._moreTilesDisplayed = true;
        this.onRender();
    },

    onChangeModelTiles() {
        this.onRender();
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

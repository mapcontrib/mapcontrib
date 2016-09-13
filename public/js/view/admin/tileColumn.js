
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import CONST from 'const';
import template from 'templates/admin/tile/tileColumn.ejs';
import templateListItem from 'templates/admin/tile/listItem.ejs';


export default Marionette.LayoutView.extend({
    template: template,
    templateListItem: templateListItem,

    behaviors() {
        return {
            'l20n': {},
            'column': {
                'appendToBody': true,
                'destroyOnClose': true,
                'routeOnClose': this.options.previousRoute,
            },
        };
    },

    ui: {
        'column': '.column',
        'tileList': '.tile_list',
        'tiles': '.tile_list input',
    },

    events: {
        'submit': 'onSubmit',
        'reset': 'onReset',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();
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

    onRender() {
        let tile;
        let html = '';
        let maxZoom = '';
        const tiles = this.model.get('tiles');

        for (const id in CONST.map.tiles) {
            tile = CONST.map.tiles[id];

            if (!tile) {
                continue;
            }

            let thumbnailHtml = '';

            for (let urlTemplate of tile.urlTemplate) {
                thumbnailHtml += `<img src="${urlTemplate}" alt="" />`;
            }

            thumbnailHtml = thumbnailHtml.replace(/\{s\}/g, 'a');
            thumbnailHtml = thumbnailHtml.replace(/\{z\}/g, '9');
            thumbnailHtml = thumbnailHtml.replace(/\{x\}/g, '265');
            thumbnailHtml = thumbnailHtml.replace(/\{y\}/g, '181');

            maxZoom = document.l10n.getSync('editTileColumn_maxZoom', {
                'maxZoom': tile.maxZoom
            });


            html += this.templateListItem({
                'name': tile.name,
                'maxZoom': maxZoom,
                'id': id,
                'thumbnailHtml': thumbnailHtml,
                'checked': (tiles.indexOf(id) > -1) ? ' checked' : '',
            });
        }

        this.ui.tileList.html( html );

        this.bindUIElements();
    },

    onSubmit(e) {
        e.preventDefault();

        let tiles = [];

        this.ui.tiles.each(function (i, tileInput) {
            if ( tileInput.checked ) {
                tiles.push( tileInput.value );
            }
        });

        if ( tiles.length === 0 ) {
            tiles = ['osm'];
        }

        this.model.set('tiles', tiles);
        this.model.updateModificationDate();

        this.model.save({}, {
            success: () => {
                this._oldModel = this.model.clone();

                this._radio.commands.execute('map:setTileLayer', tiles[0]);

                this.close();
            },
            error: () => {
                // FIXME
                console.error('nok');
            },
        });
    },

    onReset() {
        this.model.set( this._oldModel.toJSON() );

        this.ui.column.one('transitionend', this.render);

        this.close();
    },
});

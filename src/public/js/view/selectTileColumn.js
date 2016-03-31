
import _ from 'underscore';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import CONST from '../const';
import template from '../../templates/selectTileColumn.ejs';
import templateListItem from '../../templates/selectTileListItem.ejs';


export default Marionette.LayoutView.extend({

    template: template,
    templateListItem: templateListItem,

    behaviors: {

        'l20n': {},
        'column': {},
    },

    ui: {

        'column': '#select_tile_column',
        'tileList': '.tile_list',
        'tiles': '.tile_list input',
    },

    events: {

        'click @ui.tiles': 'onClickTiles',
    },

    initialize: function () {

        this._radio = Wreqr.radio.channel('global');

        var fragment = this._radio.reqres.request('getFragment'),
        storage = JSON.parse( localStorage.getItem( 'mapState-'+ fragment ) ) || {};


        this._fragment = fragment;

        if ( storage.selectedTile ) {

            this._selectedInStorage = storage.selectedTile;
        }

        this.listenTo(this.model, 'change:tiles', this.onChangeModelTiles);
    },

    onRender: function () {

        var tile, thumbnail, checked,
        tiles = this.model.get('tiles'),
        html = '';

        tiles.forEach((id) => {

            tile = CONST.map.tiles[id];

            if (!tile) {
                return;
            }

            thumbnail = tile.urlTemplate.replace('{s}', 'a');
            thumbnail = thumbnail.replace('{z}', '9');
            thumbnail = thumbnail.replace('{x}', '265');
            thumbnail = thumbnail.replace('{y}', '181');

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

                'name': tile.name,
                'id': id,
                'thumbnail': thumbnail,
                'checked': checked,
            });
        });

        this.ui.tileList.html( html );

        this.bindUIElements();
    },

    onClickTiles: function (e) {

        var newState,
        key = 'mapState-'+ this._fragment,
        oldState = JSON.parse( localStorage.getItem( key ) );

        newState = _.extend( oldState, { 'selectedTile': e.target.value } );
        localStorage.setItem( key, JSON.stringify( newState ) );

        this._radio.commands.execute('map:setTileLayer', e.target.value);
    },

    onChangeModelTiles: function () {

        this.render();
    },

    onBeforeOpen: function () {

        this._radio.vent.trigger('column:closeAll');
        this._radio.vent.trigger('widget:closeAll');
    },

    open: function () {

        this.triggerMethod('open');
    },

    close: function () {

        this.triggerMethod('close');
    },
});

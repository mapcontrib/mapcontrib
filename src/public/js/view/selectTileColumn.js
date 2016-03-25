
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');
var CONST = require('../const');


module.exports = Marionette.LayoutView.extend({

    template: require('../../templates/selectTileColumn.ejs'),
    templateListItem: require('../../templates/selectTileListItem.ejs'),

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

        var self = this,
        fragment = this._radio.reqres.request('getFragment'),
        storage = JSON.parse( localStorage.getItem( 'mapState-'+ fragment ) ) || {};


        this._fragment = fragment;

        if ( storage.selectedTile ) {

            this._selectedInStorage = storage.selectedTile;
        }

        this.listenTo(this.model, 'change:tiles', this.onChangeModelTiles);
    },

    onRender: function () {

        var tile, thumbnail, checked,
        self = this,
        tiles = this.model.get('tiles'),
        html = '';

        tiles.forEach(function (id) {

            tile = CONST.map.tiles[id];

            if (!tile) {
                return;
            }

            thumbnail = tile.urlTemplate.replace('{s}', 'a');
            thumbnail = thumbnail.replace('{z}', '9');
            thumbnail = thumbnail.replace('{x}', '265');
            thumbnail = thumbnail.replace('{y}', '181');

            if ( self._selectedInStorage && self._selectedInStorage === id ) {

                checked = ' checked';
            }
            else if (id === tiles[0]) {

                checked = ' checked';
            }
            else {

                checked = '';
            }

            html += self.templateListItem({

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

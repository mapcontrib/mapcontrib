

define([

	'underscore',
	'backbone',
	'marionette',
	'bootstrap',
	'templates',
	'const',
],
function (

	_,
	Backbone,
	Marionette,
	Bootstrap,
	templates,
	CONST
) {

	'use strict';

	return Marionette.LayoutView.extend({

		template: JST['selectTileColumn.html'],
		templateListItem: JST['selectTileListItem.html'],

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

			this._radio = Backbone.Wreqr.radio.channel('global');

			var self = this,
			fragment = this._radio.reqres.request('getFragment'),
			storage = JSON.parse( localStorage.getItem( 'mapState-'+ fragment ) );


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

		open: function () {

			this._radio.vent.trigger('column:closeAll');
			this._radio.vent.trigger('widget:closeAll');

			this.triggerMethod('open');
		},

		close: function () {

			this.triggerMethod('close');
		},
	});
});

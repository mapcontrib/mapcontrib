

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

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');
		},

		onRender: function () {

			var tile, thumbnail,
			self = this,
			tiles = this.model.get('tiles'),
			html = '';

			tiles.forEach(function (id) {

				tile = CONST.map.tiles[id];

				thumbnail = tile.urlTemplate.replace('{s}', 'a');
				thumbnail = thumbnail.replace('{z}', '9');
				thumbnail = thumbnail.replace('{x}', '265');
				thumbnail = thumbnail.replace('{y}', '181');

				html += self.templateListItem({

					'name': tile.name,
					'id': id,
					'thumbnail': thumbnail,
					'checked': (id == tiles[0]) ? ' checked' : '',
				});
			});

			this.ui.tileList.html( html );

			this.bindUIElements();
		},

		onClickTiles: function (e) {

			this._radio.commands.execute('map:setTileLayer', e.target.value);
		},

		open: function () {

			this._radio.vent.trigger('column:closeAll');

			this.triggerMethod('open');
		},

		close: function () {

			this.triggerMethod('close');
		},
	});
});

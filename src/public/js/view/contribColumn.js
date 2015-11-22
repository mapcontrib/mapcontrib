

define([

	'underscore',
	'backbone',
	'marionette',
	'bootstrap',
	'templates',
	'model/poi',
],
function (

	_,
	Backbone,
	Marionette,
	Bootstrap,
	templates,
	PoiModel
) {

	'use strict';

	return Marionette.LayoutView.extend({

		template: JST['contribColumn.html'],
		templateField: JST['contribField.html'],

		behaviors: {

			'l20n': {},
			'column': {},
		},

		ui: {

			'column': '#contrib_column',
			'tagList': '.rg_tag_list',
			'formGroups': '.form-group',
			'addBtn': '.add_btn',
			'removeBtn': '.remove_btn',
		},

		events: {

			'click @ui.addBtn': 'onClickAddBtn',
			'click @ui.removeBtn': 'onClickRemoveBtn',

			'submit': 'onSubmit',
		},

		initialize: function () {

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');
		},

		open: function (latLng) {

			this._radio.vent.trigger('column:closeAll');
			this._radio.vent.trigger('widget:closeAll');

			this.model = new PoiModel({

				'lat': latLng.lat,
				'lng': latLng.lng,
			});

			this.render();

			this.triggerMethod('open');
		},

		close: function () {

			this.triggerMethod('close');
		},

		onRender: function () {

			this.addField();
		},

		onClickAddBtn: function () {

			this.addField();
		},

		onClickRemoveBtn: function (e) {

			$(e.target).parents('.form-group').remove();
		},

		addField: function () {

			var field = $( this.templateField() ).appendTo( this.ui.tagList ).get(0);

			document.l10n.localizeNode( field );
		},

		onSubmit: function (e) {

			e.preventDefault();

			var tags = {};

			this.bindUIElements();

			console.log('onSubmit');

			this.ui.formGroups.each(function () {
				console.log(this);
			});
		},
	});
});

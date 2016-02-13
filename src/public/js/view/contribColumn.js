

define([

	'underscore',
	'backbone',
	'marionette',
	'bootstrap',
	'templates',

	'helper/osmEdit'
],
function (

	_,
	Backbone,
	Marionette,
	Bootstrap,
	templates,

	OsmEditHelper
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

		setModel: function (model) {

			this.model = model;

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

			var tags = [];

			e.preventDefault();

			this.bindUIElements();

			this.ui.formGroups.each(function () {

				var keyInput = this.querySelector('.key'),
				valueInput = this.querySelector('.value'),
				key = keyInput.value,
				value = valueInput.value,
				tag = {};

				if ( !key || !value ) {
					return;
				}

				tag[key] = value;

				tags.push(tag);
			});

			this.model.set('tags', tags);

			var osmEdit = new OsmEditHelper();

			osmEdit.createNode( this.model.attributes, function (err) {

				console.log('Node created!');
			});
		},
	});
});

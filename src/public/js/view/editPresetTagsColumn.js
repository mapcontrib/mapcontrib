

define([

    'marionette',
    'templates',
    'model/preset',
    'ui/form/nodeTags/list'
],
function (

    Marionette,
    templates,
    PresetModel,
    NodeTagsList
) {

    'use strict';

    return Marionette.LayoutView.extend({

        template: JST['editPresetTagsColumn.html'],

        behaviors: {

            'l20n': {},
            'column': {},
        },

        ui: {

            'column': '#edit_preset_tags_column',
            'tagList': '.rg_tag_list',
            'formGroups': '.form-group',
            'addBtn': '.add_btn',
        },

        events: {

            'click @ui.addBtn': 'onClickAddBtn',

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

            this.triggerMethod('open');
        },

        close: function () {

            this.triggerMethod('close');
        },

        onRender: function () {

            this._tagList = new NodeTagsList();

            this._tagList.setTags( this.model.get('tags') );

            this.ui.tagList.append( this._tagList.el );
        },

        onClickAddBtn: function () {

            this._tagList.addTag();
        },

        onSubmit: function (e) {

            var self = this,
            tags = [],
            map = this._radio.reqres.request('map');

            e.preventDefault();

            this.bindUIElements();

            console.log(this._tagList.getTags());
            return;

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


            this.close();
        },
    });
});

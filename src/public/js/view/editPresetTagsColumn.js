
var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');
var PresetModel = require('../model/preset');
var PresetNodeTagsListView = require('../ui/form/presetNodeTags');


module.exports = Marionette.LayoutView.extend({

    template: require('../../templates/editPresetTagsColumn.ejs'),

    behaviors: {

        'l20n': {},
        'column': {},
    },

    ui: {

        'column': '#edit_preset_tags_column',
        'nameInput': '#preset_name',
        'descriptionInput': '#preset_description',
        'tagList': '.rg_tag_list',
        'addBtn': '.add_btn',
    },

    events: {

        'click @ui.addBtn': 'onClickAddBtn',

        'submit': 'onSubmit',
    },

    initialize: function () {

        var self = this;

        this._radio = Wreqr.radio.channel('global');
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

        this._tagList = new PresetNodeTagsListView();

        this._tagList.setTags( this.model.get('tags') );

        this.ui.tagList.append( this._tagList.el );
    },

    onClickAddBtn: function () {

        this._tagList.addTag();
    },

    onSubmit: function (e) {

        e.preventDefault();

        var addToCollection = false;

        this.model.set('name', this.ui.nameInput.val());
        this.model.set('description', this.ui.descriptionInput.val());
        this.model.set('tags', this._tagList.getTags());


        if ( !this.model.get('_id') ) {

            addToCollection = true;
        }

        this.model.save({}, {

            'success': function () {

                if ( addToCollection ) {

                    this._radio.reqres.request('presets').add( this.model );
                }

                this.close();
            }.bind(this),

            'error': function () {

                // FIXME
                console.error('nok');
            },
        });
    },
});

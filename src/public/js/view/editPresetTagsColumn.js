
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import PresetModel from '../model/preset';
import PresetNodeTagsListView from '../ui/form/presetNodeTags';
import template from '../../templates/editPresetTagsColumn.ejs';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'column': {},
    },

    ui: {
        'column': '#edit_preset_tags_column',
        'content': '.content',
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

        let scrollHeight = this.ui.column.height() +
        this._tagList.el.scrollHeight;
        this.ui.content[0].scrollTo(0, scrollHeight);
    },

    onSubmit: function (e) {
        e.preventDefault();

        this.model.set('name', this.ui.nameInput.val());
        this.model.set('description', this.ui.descriptionInput.val());
        this.model.set('tags', this._tagList.getTags());

        if (this.options.isNew) {
            this.options.theme.get('presets').add( this.model );
        }

        this.options.theme.set('modificationDate', new Date().toISOString());
        this.options.theme.save({}, {
            'success': function () {
                this.close();
            }.bind(this),

            'error': function () {
                // FIXME
                console.error('nok');
            },
        });
    },
});

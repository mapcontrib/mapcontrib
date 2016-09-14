
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import PresetNodeTagsListView from 'ui/form/presetNodeTags';
import template from 'templates/admin/preset/presetEditColumn.ejs';


export default Marionette.LayoutView.extend({
    template,

    behaviors() {
        return {
            l20n: {},
            column: {
                appendToBody: true,
                destroyOnClose: true,
                routeOnClose: this.options.previousRoute,
            },
        };
    },

    ui: {
        column: '#edit_preset_tags_column',
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

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    setModel(model) {
        this.model = model;

        this.render();
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
        this._tagList = new PresetNodeTagsListView();

        this._tagList.setTags( this.model.get('tags') );

        this.ui.tagList.append( this._tagList.el );
    },

    onClickAddBtn() {
        this._tagList.addTag();

        let scrollHeight = this.ui.column.height() +
        this._tagList.el.scrollHeight;
        this.ui.content[0].scrollTo(0, scrollHeight);
    },

    onSubmit(e) {
        e.preventDefault();

        this.model.set('name', this.ui.nameInput.val());
        this.model.set('description', this.ui.descriptionInput.val());
        this.model.set('tags', this._tagList.getTags());

        if (this.options.isNew) {
            this.options.theme.get('presets').add( this.model );
        }

        this.model.updateModificationDate();
        this.options.theme.updateModificationDate();
        this.options.theme.save({}, {
            success: () => this.close(),

            error: () => {
                // FIXME
                console.error('nok');
            },
        });
    },
});

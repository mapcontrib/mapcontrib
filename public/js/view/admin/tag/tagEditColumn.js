
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
// import PresetModel from 'model/preset';
// import EditPresetListView from './editPresetList';
// import EditPresetTagsColumnView from './editPresetTagsColumn';
import template from 'templates/admin/tag/tagEditColumn.ejs';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors() {
        return {
            'l20n': {},
            'column': {
                'appendToBody': true,
                'destroyOnClose': true,
                'routeOnClose': this.options.previousRoute,
            },
        };
    },

    regions: {
        'tagList': '.rg_list',
    },

    ui: {
        'column': '.column',
        'addButton': '.add_btn',
    },

    events: {
        'click @ui.addButton': 'onClickAdd',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    onRender() {
        // const presets = this.model.get('presets');
        // const editPresetListView = new EditPresetListView({
        //     'collection': presets,
        //     'theme': this.model
        // });
        //
        // this.getRegion('presetList').show( editPresetListView );
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    onClickAdd() {
        this.close();
        this.options.router.navigate('admin/tag/new', true);
    },
});


import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import PresetModel from '../model/preset';
import EditPresetListView from './editPresetList';
import EditPresetTagsColumnView from './editPresetTagsColumn';
import template from '../../templates/editPresetColumn.ejs';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'column': {},
    },

    regions: {
        'presetList': '.rg_preset_list',
    },

    ui: {
        'column': '#edit_preset_column',
        'addButton': '.add_btn',
    },

    events: {
        'click @ui.addButton': 'onClickAdd',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    onRender() {
        var presets = this.model.get('presets'),
        editPresetListView = new EditPresetListView({
            'collection': presets,
            'theme': this.model
        });

        this.getRegion('presetList').show( editPresetListView );
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
        this._radio.commands.execute('column:showPresetTags');
    },
});

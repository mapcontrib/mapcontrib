
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import PresetModel from 'model/preset';
import ListGroup from 'ui/listGroup';
import EditPresetTagsColumnView from './editPresetTagsColumn';
import template from 'templates/editPresetColumn.ejs';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'column': {},
    },

    regions: {
        'list': '.rg_list',
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
        const listGroup = new ListGroup({
            collection: this.model.get('presets'),
            reorderable: true,
            removeable: true,
            placeholder: document.l10n.getSync('uiListGroup_placeholder'),
        });

        this.listenTo(listGroup, 'reorder', this.onReorder);
        this.listenTo(listGroup, 'item:remove', this.onRemove);
        this.listenTo(listGroup, 'item:select', this.onSelect);

        this.getRegion('list').show( listGroup );
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

    onReorder() {
        this.model.updateModificationDate();
        this.model.save();
    },

    onRemove() {
        this.model.save();
    },

    onSelect(model) {
        this._radio.commands.execute( 'column:showPresetTags', model );
    },
});

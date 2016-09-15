
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import ListGroup from 'ui/listGroup';
import template from 'templates/editLayerListColumn.ejs';
import CONST from 'const';
import MapUi from 'ui/map';


export default Marionette.LayoutView.extend({
    template,

    behaviors: {
        l20n: {},
        column: {},
    },

    regions: {
        list: '.rg_list',
    },

    ui: {
        column: '#edit_layer_column',
        addButton: '.add_btn',
    },

    events: {
        'click @ui.addButton': 'onClickAdd',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    onRender() {
        const listGroup = new ListGroup({
            collection: this.model.get('layers'),
            labelAttribute: 'name',
            reorderable: true,
            removeable: true,
            getIcon: model => MapUi.buildLayerHtmlIcon(model),
            placeholder: document.l10n.getSync('uiListGroup_placeholder'),
        });

        this.listenTo(listGroup, 'reorder', this._onReorder);
        this.listenTo(listGroup, 'item:remove', this._onRemove);
        this.listenTo(listGroup, 'item:select', this._onSelect);

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
        this._radio.commands.execute('column:showAddLayerMenu');
    },

    _onReorder() {
        this.model.updateModificationDate();
        this.model.save();
    },

    _onRemove(model) {
        model.destroy();
        this.model.save();
    },

    _onSelect(model) {
        switch (model.get('type')) {
            case CONST.layerType.overpass:
                return this._radio.commands.execute( 'column:editOverPassLayer', model );
            case CONST.layerType.gpx:
                return this._radio.commands.execute( 'column:editGpxLayer', model );
            case CONST.layerType.csv:
                return this._radio.commands.execute( 'column:editCsvLayer', model );
            case CONST.layerType.geojson:
                return this._radio.commands.execute( 'column:editGeoJsonLayer', model );
            case CONST.layerType.osmose:
                return this._radio.commands.execute( 'column:editOsmoseLayer', model );
            default:
                return false;
        }
    },
});

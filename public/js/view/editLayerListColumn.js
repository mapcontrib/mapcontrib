
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
            collection: this.model.get('layers'),
            reorderable: true,
            removeable: true,
            getIcon: model => MapUi.buildLayerHtmlIcon(model),
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
        this._radio.commands.execute('column:showAddLayerMenu');
    },

    onReorder() {
        this.model.updateModificationDate();
        this.model.save();
    },

    onRemove() {
        this.model.save();
    },

    onSelect(model) {
        switch (model.get('type')) {
            case CONST.layerType.overpass:
                this._radio.commands.execute( 'column:editOverPassLayer', model );
                break;
            case CONST.layerType.gpx:
                this._radio.commands.execute( 'column:editGpxLayer', model );
                break;
            case CONST.layerType.csv:
                this._radio.commands.execute( 'column:editCsvLayer', model );
                break;
            case CONST.layerType.geojson:
                this._radio.commands.execute( 'column:editGeoJsonLayer', model );
                break;
            case CONST.layerType.osmose:
                this._radio.commands.execute( 'column:editOsmoseLayer', model );
                break;
        }
    },
});

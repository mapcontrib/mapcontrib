
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import ListGroup from 'ui/listGroup';
import template from 'templates/tempLayerListColumn.ejs';
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
        column: '#temp_layer_column',
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
            collection: this.collection,
            labelAttribute: 'name',
            reorderable: true,
            removeable: true,
            getRightIcon: model => MapUi.buildLayerHtmlIcon(model),
            placeholder: document.l10n.getSync('uiListGroup_placeholder'),
        });

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
        this._radio.commands.execute('column:showAddTempLayerMenu');
    },

    onSelect(model) {
        switch (model.get('type')) {
            case CONST.layerType.overpass:
                return this._radio.commands.execute( 'column:tempOverPassLayer', model );
            case CONST.layerType.gpx:
                return this._radio.commands.execute( 'column:tempGpxLayer', model );
            case CONST.layerType.csv:
                return this._radio.commands.execute( 'column:tempCsvLayer', model );
            case CONST.layerType.geojson:
                return this._radio.commands.execute( 'column:tempGeoJsonLayer', model );
            case CONST.layerType.osmose:
                return this._radio.commands.execute( 'column:tempOsmoseLayer', model );
            default:
                return false;
        }
    },
});

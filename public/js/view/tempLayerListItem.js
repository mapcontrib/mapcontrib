
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from 'ui/map';
import CONST from 'const';
import template from 'templates/tempLayerListItem.ejs';


export default Marionette.ItemView.extend({
    template: template,

    tagName: 'a',

    className: 'list-group-item',

    attributes: {
        'href': '#',
    },

    modelEvents: {
        'change': 'render'
    },

    ui: {
        'remove_btn': '.remove_btn'
    },

    events: {
        'click': 'onClick',
        'click @ui.remove_btn': 'onClickRemove',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    templateHelpers() {
        return {
            'icon': MapUi.buildLayerHtmlIcon( this.model ),
        };
    },

    onRender() {
        this.el.id = 'temp-layer-'+ this.model.cid;
    },

    onClick() {
        switch (this.model.get('type')) {
            case CONST.layerType.overpass:
                this._radio.commands.execute( 'column:tempOverPassLayer', this.model );
                break;
            case CONST.layerType.gpx:
                this._radio.commands.execute( 'column:tempGpxLayer', this.model );
                break;
            case CONST.layerType.csv:
                this._radio.commands.execute( 'column:tempCsvLayer', this.model );
                break;
            case CONST.layerType.geojson:
            this._radio.commands.execute( 'column:tempGeoJsonLayer', this.model );
                break;
            case CONST.layerType.osmose:
            this._radio.commands.execute( 'column:tempOsmoseLayer', this.model );
                break;
        }
    },

    onClickRemove(e) {
        e.stopPropagation();

        this.model.destroy();
    },
});

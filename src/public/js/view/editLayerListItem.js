
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from '../ui/map';
import CONST from '../const';
import template from '../../templates/editLayerListItem.ejs';


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

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');
    },

    templateHelpers: function () {
        return {
            'marker': MapUi.buildLayerHtmlIcon( this.model ),
        };
    },

    onRender: function () {
        this.el.id = 'poi-layer-'+ this.model.cid;
    },

    onClick: function () {
        switch (this.model.get('type')) {
            case CONST.layerType.overpass:
                this._radio.commands.execute( 'column:editOverPassLayer', this.model );
                break;
            case CONST.layerType.gpx:
                this._radio.commands.execute( 'column:editGpxLayer', this.model );
                break;
            case CONST.layerType.csv:
                this._radio.commands.execute( 'column:editCsvLayer', this.model );
                break;
            case CONST.layerType.osmose:
                this._radio.commands.execute( 'column:editOsmoseLayer', this.model );
                break;
        }
    },

    onClickRemove: function (e) {
        e.stopPropagation();

        this.model.destroy();
        this._radio.commands.execute('theme:save');
    },
});

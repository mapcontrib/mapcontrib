
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from '../ui/map';
import template from '../../templates/editPoiLayerListItem.ejs';


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
            'marker': MapUi.buildPoiLayerHtmlIcon( this.model ),
        };
    },

    onRender: function () {
        this.el.id = 'poi-layer-'+ this.model.cid;
    },

    onClick: function () {
        this._radio.commands.execute( 'column:showPoiLayer', this.model );
    },

    onClickRemove: function (e) {
        e.stopPropagation();

        this.model.destroy();
    },
});


import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/addTempLayerMenuColumn.ejs';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'column': {},
    },

    ui: {
        'column': '#add_temp_layer_menu_column',
        'overPassItem': '.overpass_item',
        'gpxItem': '.gpx_item',
        'csvItem': '.csv_item',
        'geoJsonItem': '.geojson_item',
    },

    events: {
        'click @ui.overPassItem': 'onClickOverPass',
        'click @ui.gpxItem': 'onClickGpx',
        'click @ui.csvItem': 'onClickCsv',
        'click @ui.geoJsonItem': 'onClickGeoJson',
    },

    initialize(options) {
        this._radio = Wreqr.radio.channel('global');
    },

    onRender() {
        if ( !File || !FileList || !FileReader) {
            this.ui.gpxItem.addClass('hide');
            this.ui.csvItem.addClass('hide');
            this.ui.geoJsonItem.addClass('hide');
        }
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

    onClickOverPass(e) {
        e.preventDefault();
        this.close();
        this._radio.commands.execute('column:tempOverPassLayer');
    },

    onClickGpx(e) {
        e.preventDefault();
        this.close();
        this._radio.commands.execute('column:tempGpxLayer');
    },

    onClickCsv(e) {
        e.preventDefault();
        this.close();
        this._radio.commands.execute('column:tempCsvLayer');
    },

    onClickGeoJson(e) {
        e.preventDefault();
        this.close();
        this._radio.commands.execute('column:tempGeoJsonLayer');
    },
});

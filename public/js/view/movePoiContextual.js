
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from 'ui/map';
import template from 'templates/movePoiContextual.ejs';


export default Marionette.ItemView.extend({
    template,

    behaviors: {
        l20n: {},
        contextual: {
            destroyOnClose: true,
        },
    },

    ui: {
        validateBtn: '.validate_btn',
        cancelBtn: '.cancel_btn',
        contextual: '.contextual',
    },

    events: {
        'click @ui.cancelBtn': 'onClickCancel',
        'click @ui.validateBtn': 'onClickValidate',
    },

    initialize(options) {
        this._radio = Wreqr.radio.channel('global');
        this._map = this._radio.reqres.request('map');

        this._marker = options.marker;
        this._editPoiColumnView = options.editPoiColumnView;

        return this.render();
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    onOpen() {
        this._marker.closePopup();
        MapUi.showContributionCross();

        this._map.panTo(
            this._marker.getLatLng(),
            { animate: true }
        );
    },

    onBeforeClose() {
        MapUi.hideContributionCross();
    },

    onClickCancel() {
        this.close();
        this._editPoiColumnView.open();
    },

    onClickValidate() {
        MapUi.hideContributionCross();

        const mapCenter = this._map.getCenter();

        this._editPoiColumnView.open();
        this._editPoiColumnView.setNewPosition(mapCenter.lat, mapCenter.lng);

        this.close();
    },
});

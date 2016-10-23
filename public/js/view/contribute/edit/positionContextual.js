
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/contribute/edit/positionContextual.ejs';
import MapUi from 'ui/map';


export default Marionette.ItemView.extend({
    template,

    behaviors: {
        l20n: {},
        contextual: {
            destroyOnClose: true,
            appendToBody: true,
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

    initialize() {
        this._radio = Wreqr.radio.channel('global');
        this._map = this._radio.reqres.request('map');

        this._layer = this.options.layer;
        this._formColumnView = this.options.formColumnView;

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
        this._layer.closePopup();
        MapUi.showContributionCross();

        this._map.panTo(
            this._layer.getLatLng(),
            { animate: true }
        );
    },

    onBeforeClose() {
        MapUi.hideContributionCross();
    },

    onClickCancel() {
        this.close();
        this._formColumnView.open();
    },

    onClickValidate() {
        MapUi.hideContributionCross();

        const mapCenter = this._map.getCenter();

        this._formColumnView.open();
        this._formColumnView.setNewPosition(mapCenter.lat, mapCenter.lng);

        this.close();
    },
});


import $ from 'jquery';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/link/linkColumn.ejs';
import templateIframe from 'templates/link/iframe.ejs';


export default Marionette.LayoutView.extend({
    template,
    templateIframe,

    behaviors() {
        return {
            l20n: {},
            column: {
                appendToBody: true,
                destroyOnClose: true,
                routeOnClose: this.options.previousRoute,
            },
        };
    },

    ui: {
        column: '.column',
        autoSelects: '.auto_select',
        linkUrl: '.link_url',
        linkPosition: '#link_include_position',
        iframeCode: '.iframe_code',
        iframePosition: '#iframe_include_position',
        iframeWidth: '#iframe_width',
        iframeHeight: '#iframe_height',
        iframeWidthUnit: '#iframe_width_unit',
        iframeHeightUnit: '#iframe_height_unit',
        iframeWidthUnitDropdown: '#iframe_width_unit_dropdown',
        iframeHeightUnitDropdown: '#iframe_height_unit_dropdown',
    },

    events: {
        'click @ui.linkPosition': 'renderLinkUrl',
        'click @ui.autoSelects': 'onClickAutoSelects',
        'click @ui.iframePosition': 'renderIframeCode',
        'keyup @ui.iframeWidth, @ui.iframeHeight': 'renderIframeCode',
        'change @ui.iframeWidth, @ui.iframeHeight': 'renderIframeCode',
        'click @ui.iframeWidthUnitDropdown a': 'onClickWidthUnit',
        'click @ui.iframeHeightUnitDropdown a': 'onClickHeightUnit',
    },

    modelEvents: {
        change: 'render',
    },

    templateHelpers() {
        return {
            iframeWidth: MAPCONTRIB.config.shareIframeWidth,
            iframeWidthUnit: MAPCONTRIB.config.shareIframeWidthUnit,
            iframeHeight: MAPCONTRIB.config.shareIframeHeight,
            iframeHeightUnit: MAPCONTRIB.config.shareIframeHeightUnit,
        };
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
        this._radio.vent.on('map:zoomChanged map:centerChanged', this.renderLinkUrl, this);
        this._radio.vent.on('map:zoomChanged map:centerChanged', this.renderIframeCode, this);
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

    onRender() {
        this.renderLinkUrl();
        this.renderIframeCode();
    },

    renderLinkUrl() {
        this.ui.linkUrl.val( this.getLinkUrl() );
    },

    renderIframeCode() {
        const html = this.templateIframe({
            url: this.getIframeUrl(),
            iframeWidth: this.ui.iframeWidth.val(),
            iframeHeight: this.ui.iframeHeight.val(),
            iframeWidthUnit: (this.ui.iframeWidthUnit.html() === 'px') ? '' : this.ui.iframeWidthUnit.html(),
            iframeHeightUnit: (this.ui.iframeHeightUnit.html() === 'px') ? '' : this.ui.iframeHeightUnit.html(),
            subLinkMessage: document.l10n.getSync('linkColumn_seeBigger'),
        });

        this.ui.iframeCode.html( html );
    },

    onClickAutoSelects(e) {
        e.target.select();
    },

    onClickWidthUnit(e) {
        e.preventDefault();

        this.ui.iframeWidthUnit.html( $(e.target).data('unit') );

        this.renderIframeCode();
    },

    onClickHeightUnit(e) {
        e.preventDefault();

        this.ui.iframeHeightUnit.html( $(e.target).data('unit') );

        this.renderIframeCode();
    },

    getUrl() {
        const protocol = window.location.protocol;
        const host = window.location.host;
        const path = this.model.buildPath();

        return `${protocol}//${host}${path}`;
    },

    getUrlWithPosition() {
        const map = this._radio.reqres.request('map');
        const zoom = map.getZoom();
        const { lat, lng } = map.getCenter();
        const url = this.getUrl();

        return `${url}#position/${zoom}/${lat}/${lng}`;
    },

    getLinkUrl() {
        if (this.ui.linkPosition.prop('checked')) {
            return this.getUrlWithPosition();
        }

        return this.getUrl();
    },

    getIframeUrl() {
        if (this.ui.iframePosition.prop('checked')) {
            return this.getUrlWithPosition();
        }

        return this.getUrl();
    },
});

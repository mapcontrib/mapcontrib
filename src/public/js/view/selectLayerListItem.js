
import _ from 'underscore';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import marked from 'marked';
import MapUi from '../ui/map';
import template from '../../templates/selectLayerListItem.ejs';


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
        'visibilityCheckbox': '.visibility_checkbox',
        'zoomTip': '.zoom_tip',
    },

    events: {
        'click': 'onClick',
        'click label': 'onClickLabel',
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');

        var fragment = this._radio.reqres.request('getFragment'),
        storage = JSON.parse( localStorage.getItem( 'mapState-'+ fragment ) );


        this._fragment = fragment;

        if ( storage && storage.hiddenLayers && storage.hiddenLayers.indexOf(this.model.get('uniqid')) > -1 ) {
            this._layerIsVisible = false;
        }
        else {
            this._layerIsVisible = true;
        }

        this._radio.vent.on('map:zoomChanged', this.render, this);
    },

    templateHelpers: function () {
        return {
            'description': marked( this.model.get('description') || '' ),
            'marker': MapUi.buildLayerHtmlIcon( this.model ),
        };
    },

    onRender: function () {
        var currentZoom = this._radio.reqres.request('map:getCurrentZoom'),
        n = (this.model.get('minZoom') - currentZoom) || 0;

        if ( n > 0 ) {
            this.ui.zoomTip
            .html( document.l10n.getSync('selectLayerColumn_needToZoom', {'n': n}) )
            .removeClass('hide');
        }
        else {
            this.ui.zoomTip
            .addClass('hide')
            .empty();
        }

        this.ui.visibilityCheckbox.prop('checked', this._layerIsVisible);
    },

    onClick: function (e) {
        e.stopPropagation();

        var newState,
        key = 'mapState-'+ this._fragment,
        oldState = JSON.parse( localStorage.getItem( key ) ) || {},
        hiddenLayers = oldState.hiddenLayers || [];

        this._layerIsVisible = this._layerIsVisible ? false : true;

        this.ui.visibilityCheckbox[0].checked = this._layerIsVisible;

        if ( this._layerIsVisible ) {
            this._radio.commands.execute( 'map:showLayer', this.model );

            hiddenLayers = _.without( hiddenLayers, this.model.get('uniqid') );
        }
        else {
            this._radio.commands.execute( 'map:hideLayer', this.model );

            hiddenLayers = _.union( hiddenLayers, [this.model.get('uniqid')] );
        }

        newState = _.extend( oldState, { 'hiddenLayers': hiddenLayers } );
        localStorage.setItem( key, JSON.stringify( newState ) );
    },

    onClickLabel: function (e) {
        e.preventDefault();
    },
});

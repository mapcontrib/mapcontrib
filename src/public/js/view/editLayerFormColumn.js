
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from '../ui/map';
import template from '../../templates/editLayerFormColumn.ejs';


export default Marionette.ItemView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'column': {
            'destroyOnClose': true,
        },
    },

    ui: {
        'column': '#edit_poi_layer_column',

        'layerName': '#layer_name',
        'layerDescription': '#layer_description',
        'layerDataEditable': '#layer_data_editable',
        'layerVisible': '#layer_visible',
        'layerMinZoom': '#layer_min_zoom',
        'layerOverpassRequest': '#layer_overpass_request',
        'layerPopupContent': '#layer_popup_content',

        'markerWrapper': '.marker-wrapper',
        'editMarkerButton': '.edit_marker_btn',
        'currentMapZoom': '.current_map_zoom',
    },

    events: {
        'click @ui.editMarkerButton': 'onClickEditMarker',
        'submit': 'onSubmit',
        'reset': 'onReset',
    },

    templateHelpers: function () {
        return {
            'marker': MapUi.buildLayerHtmlIcon( this.model ),
        };
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();

        this.listenTo(this.model, 'change', this.updateMarkerIcon);
        this._radio.vent.on('map:zoomChanged', this.onChangedMapZoom.bind(this));
    },

    onRender: function () {
        this.ui.layerVisible.prop('checked', this.model.get('visible'));
        this.ui.layerDataEditable.prop('checked', this.model.get('dataEditable'));

        this.onChangedMapZoom();
    },

    onDestroy: function () {
        this._radio.vent.off('map:zoomChanged');
    },

    open: function () {
        this.triggerMethod('open');
    },

    close: function () {
        this.triggerMethod('close');
    },

    onChangedMapZoom: function () {
        var currentMapZoom = this._radio.reqres.request('map:getCurrentZoom');

        this.ui.currentMapZoom.html(
            document.l10n.getSync(
                'editLayerFormColumn_currentMapZoom', {'currentMapZoom': currentMapZoom}
            )
        );
    },
    updateMarkerIcon: function () {
        var html = MapUi.buildLayerHtmlIcon( this.model );

        this.ui.markerWrapper.html( html );
    },

    onClickEditMarker: function () {
        this._radio.commands.execute( 'modal:showEditPoiMarker', this.model );
    },

    onSubmit: function (e) {
        e.preventDefault();

        var addToMap = false,
        updateMarkers = false,
        updateMinZoom = false,
        updatePopups = false,
        updateVisibility = false;

        this.model.set('name', this.ui.layerName.val());
        this.model.set('description', this.ui.layerDescription.val());
        this.model.set('visible', this.ui.layerVisible.prop('checked'));
        this.model.set('dataEditable', this.ui.layerDataEditable.prop('checked'));
        this.model.set('minZoom', parseInt( this.ui.layerMinZoom.val() ));
        this.model.set('overpassRequest', this.ui.layerOverpassRequest.val());
        this.model.set('popupContent', this.ui.layerPopupContent.val());

        if ( typeof this._oldModel.get('overpassRequest') === 'undefined' ) {
            addToMap = true;
        }

        if ( this._oldModel.get('minZoom') !== this.model.get('minZoom') ) {
            updateMinZoom = true;
        }

        if ( this._oldModel.get('dataEditable') !== this.model.get('dataEditable') ) {
            updatePopups = true;
        }

        if ( this._oldModel.get('markerIconType') !== this.model.get('markerIconType') ) {
            updateMarkers = true;
        }

        if ( this._oldModel.get('markerIconUrl') !== this.model.get('markerIconUrl') ) {
            updateMarkers = true;
        }

        if ( this._oldModel.get('markerColor') !== this.model.get('markerColor') ) {
            updateMarkers = true;
        }

        if ( this._oldModel.get('markerIcon') !== this.model.get('markerIcon') ) {
            updateMarkers = true;
        }

        if ( this._oldModel.get('markerShape') !== this.model.get('markerShape') ) {
            updateMarkers = true;
        }

        if ( this._oldModel.get('popupContent') !== this.model.get('popupContent') ) {
            updatePopups = true;
        }

        if ( this._oldModel.get('visible') !== this.model.get('visible') ) {
            updateVisibility = true;
        }

        this.options.theme.save({}, {
            'success': () => {
                if ( addToMap ) {
                    this._radio.commands.execute('map:addLayer', this.model);
                }

                if ( updateMinZoom ) {
                    this._radio.commands.execute('map:updateLayerMinZoom', this.model);
                }

                if ( updateMarkers ) {
                    this._radio.commands.execute('map:updateLayerIcons', this.model);
                }

                if ( updatePopups ) {
                    this._radio.commands.execute('map:updateLayerPopups', this.model);
                }

                if ( updateVisibility ) {
                    if ( this.model.get('visible') ) {
                        this._radio.commands.execute('map:addLayer', this.model);
                    }
                    else {
                        this._radio.commands.execute('map:removeLayer', this.model);
                    }

                    this._radio.commands.execute('column:selectLayer:render');
                }

                this.close();
            },
            'error': () => {
                // FIXME
                console.error('nok');
            },
        });
    },

    onReset: function () {
        this.model.set( this._oldModel.toJSON() );

        this.ui.column.one('transitionend', this.render);

        this.close();
    },
});

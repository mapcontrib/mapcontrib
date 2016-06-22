
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from '../ui/map';
import CONST from '../const';
import template from '../../templates/editGpxLayerFormColumn.ejs';


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
        'form': 'form',

        'layerName': '#layer_name',
        'layerDescription': '#layer_description',
        'layerVisible': '#layer_visible',
        'layerPopupContent': '#layer_popup_content',
        'layerFile': '#layer_file',

        'markerWrapper': '.marker-wrapper',
        'editMarkerButton': '.edit_marker_btn',
    },

    events: {
        'click @ui.editMarkerButton': 'onClickEditMarker',
        'submit': 'onSubmit',
        'reset': 'onReset',
    },

    templateHelpers: function () {
        const maxFileSize = Math.round( config.uploadMaxShapeFileSize / 1024 );
        return {
            'marker': MapUi.buildLayerHtmlIcon( this.model ),
            'fragment': this.options.theme.get('fragment'),
            'apiPath': `${CONST.apiPath}upload/shape`,
            'maxFileSize': document.l10n.getSync('maxFileSize', {maxFileSize}),
        };
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();

        this.listenTo(this.model, 'change', this.updateMarkerIcon);
    },

    onRender: function () {
        this.ui.layerVisible.prop('checked', this.model.get('visible'));
    },

    onShow: function () {
        this.ui.layerFile.filestyle({
            'icon': false,
            'badge': false,
            'buttonText': document.l10n.getSync('editLayerFormColumn_browse'),
        });
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

    updateMarkerIcon: function () {
        var html = MapUi.buildLayerHtmlIcon( this.model );

        this.ui.markerWrapper.html( html );
    },

    onClickEditMarker: function () {
        this._radio.commands.execute( 'modal:showEditPoiMarker', this.model );
    },

    onSubmit: function (e) {
        e.preventDefault();

        this.ui.form.ajaxSubmit({
            'error': xhr => {

            },
            'success': response => {
                let file = response[0];
                this.model.set('fileUri', file.layer_file);
                this.saveLayer();
            }
        });
    },

    saveLayer: function () {
        let updateMarkers = false,
        updateMinZoom = false,
        updatePopups = false,
        updateVisibility = false;

        this.model.set('name', this.ui.layerName.val());
        this.model.set('description', this.ui.layerDescription.val());
        this.model.set('visible', this.ui.layerVisible.prop('checked'));
        this.model.set('popupContent', this.ui.layerPopupContent.val());

        if ( this._oldModel.get('minZoom') !== this.model.get('minZoom') ) {
            updateMinZoom = true;
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

        if ( this.options.isNew ) {
            this.options.theme.get('layers').add( this.model );
        }

        this.options.theme.save({}, {
            'success': () => {
                if ( this.options.isNew ) {
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


import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from '../ui/map';
import { basename, extensionname } from '../core/utils';
import CONST from '../const';
import template from '../../templates/editCsvLayerFormColumn.ejs';


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
        'layerMinZoom': '#layer_min_zoom',
        'layerPopupContent': '#layer_popup_content',
        'layerFile': '#layer_file',

        'markerWrapper': '.marker-wrapper',
        'editMarkerButton': '.edit_marker_btn',
        'currentMapZoom': '.current_map_zoom',

        'formGroups': '.form-group',
        'fileFormGroup': '.form-group.layer_file',

        'actualFile': '.actual_file',
    },

    events: {
        'click @ui.editMarkerButton': 'onClickEditMarker',
        'submit': 'onSubmit',
        'reset': 'onReset',
    },

    templateHelpers: function () {
        const config = MAPCONTRIB.config;
        const maxFileSize = Math.round( config.uploadMaxShapeFileSize / 1024 );
        const file = basename(this.model.get('fileUri') || '');

        return {
            'marker': MapUi.buildLayerHtmlIcon( this.model ),
            'fragment': this.options.theme.get('fragment'),
            'apiPath': `${CONST.apiPath}file/shape`,
            'maxFileSize': document.l10n.getSync('maxFileSize', {maxFileSize}),
            'file': file
        };
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');

        if ( this.options.isNew ) {
            this.model.set('minZoom', 0);
        }

        this._oldModel = this.model.clone();

        this.listenTo(this.model, 'change', this.updateMarkerIcon);
        this._radio.vent.on('map:zoomChanged', this.onChangedMapZoom.bind(this));
    },

    onRender: function () {
        this.ui.layerVisible.prop('checked', this.model.get('visible'));

        if ( this.model.get('fileUri') ) {
            this.ui.actualFile.removeClass('hide');
        }

        this.onChangedMapZoom();
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

        this.ui.formGroups.removeClass('has-feedback has-error');

        let fileName = this.ui.layerFile.val();

        if ( !fileName && this.options.isNew ) {
            this.ui.fileFormGroup.addClass('has-feedback has-error');
            return false;
        }
        else if ( fileName ) {
            let extension = extensionname(fileName).toLowerCase();

            if (extension !== 'csv') {
                this.ui.fileFormGroup.addClass('has-feedback has-error');
                return false;
            }

            this.ui.form.ajaxSubmit({
                'error': xhr => {
                    switch (xhr.status) {
                        case 413:
                        this.ui.fileFormGroup.addClass('has-feedback has-error');
                        break;
                        case 415:
                        this.ui.fileFormGroup.addClass('has-feedback has-error');
                        break;
                    }
                },
                'success': response => {
                    let file = response[0];
                    this.model.set('fileUri', file.layer_file);
                    this.saveLayer();
                }
            });
        }
        else {
            this.saveLayer();
        }
    },

    saveLayer: function () {
        let updateMarkers = false,
        updateMinZoom = false,
        updatePopups = false,
        updateVisibility = false;

        this.model.set('name', this.ui.layerName.val());
        this.model.set('description', this.ui.layerDescription.val());
        this.model.set('minZoom', parseInt( this.ui.layerMinZoom.val() ));
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
                else {
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


import moment from 'moment-timezone';
import Locale from '../core/locale';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from '../ui/map';
import template from '../../templates/editOverPassLayerFormColumn.ejs';
import CONST from '../const';
import MarkedHelper from '../helper/marked';


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
        'overPassInfo': '.info_overpass_btn',
        'layerOverpassRequest': '#layer_overpass_request',
        'layerPopupContent': '#layer_popup_content',
        'infoDisplayInfo': '.info_info_display_btn',
        'layerCache': '#layer_cache',

        'markerWrapper': '.marker-wrapper',
        'editMarkerButton': '.edit_marker_btn',
        'currentMapZoom': '.current_map_zoom',
        'cacheSection': '.cache_section',
        'cacheInfo': '.info_cache_btn',
        'cacheDate': '.cache_date',
        'cacheErrorTimeout': '.cache_error_timeout',
        'cacheErrorMemory': '.cache_error_memory',
        'cacheErrorBadRequest': '.cache_error_bad_request',
        'cacheErrorUnknown': '.cache_error_unknown',
    },

    events: {
        'click @ui.editMarkerButton': 'onClickEditMarker',
        'submit': 'onSubmit',
        'reset': 'onReset',
    },

    templateHelpers() {
        return {
            'marker': MapUi.buildLayerHtmlIcon( this.model ),
        };
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();

        this.listenTo(this.model, 'change', this.updateMarkerIcon);
        this._radio.vent.on('map:zoomChanged', this.onChangedMapZoom, this);
    },

    onRender() {
        this.ui.layerVisible.prop('checked', this.model.get('visible'));
        this.ui.layerDataEditable.prop('checked', this.model.get('dataEditable'));
        this.ui.layerCache.prop('checked', this.model.get('cache'));

        if ( MAPCONTRIB.config.overPassCacheEnabled === true ) {
            this.ui.cacheSection.removeClass('hide');
        }

        if ( this.model.get('cacheUpdateDate') ) {
            moment.locale(
                Locale.getLocale()
            );

            const timezone = moment.tz.guess();
            const date = moment.utc(
                this.model.get('cacheUpdateDate')
            )
            .tz(timezone)
            .fromNow();

            this.ui.cacheDate
            .html(
                document.l10n.getSync(
                    'editLayerFormColumn_cacheDate',
                    { date }
                )
            )
            .removeClass('hide');
        }

        const cacheUpdateError = this.model.get('cacheUpdateError');

        if ( cacheUpdateError ) {
            switch (cacheUpdateError) {
                case CONST.overPassCacheError.timeout:
                    this.ui.cacheErrorTimeout.removeClass('hide');
                    break;
                case CONST.overPassCacheError.memory:
                    this.ui.cacheErrorMemory.removeClass('hide');
                    break;
                case CONST.overPassCacheError.badRequest:
                    this.ui.cacheErrorBadRequest.removeClass('hide');
                    break;
                default:
                    this.ui.cacheErrorUnknown.removeClass('hide');
            }
        }

        this.onChangedMapZoom();
    },

    onShow() {
        this.ui.infoDisplayInfo.popover({
            'container': 'body',
            'placement': 'left',
            'trigger': 'focus',
            'html': true,
            'title': document.l10n.getSync('editLayerFormColumn_infoDisplayPopoverTitle'),
            'content': MarkedHelper.render(
                document.l10n.getSync('editLayerFormColumn_infoDisplayPopoverContent')
            ),
        });

        this.ui.overPassInfo.popover({
            'container': 'body',
            'placement': 'left',
            'trigger': 'focus',
            'html': true,
            'title': document.l10n.getSync('editLayerFormColumn_overPassPopoverTitle'),
            'content': MarkedHelper.render(
                document.l10n.getSync('editLayerFormColumn_overPassPopoverContent')
            ),
        });

        this.ui.cacheInfo.popover({
            'container': 'body',
            'placement': 'left',
            'trigger': 'focus',
            'html': true,
            'title': document.l10n.getSync('editLayerFormColumn_cachePopoverTitle'),
            'content': MarkedHelper.render(
                document.l10n.getSync('editLayerFormColumn_cachePopoverContent')
            ),
        });
    },

    onDestroy() {
        this._radio.vent.off('map:zoomChanged', this.onChangedMapZoom);
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    onChangedMapZoom() {
        var currentMapZoom = this._radio.reqres.request('map:currentZoom');

        this.ui.currentMapZoom.html(
            document.l10n.getSync(
                'editLayerFormColumn_currentMapZoom', {'currentMapZoom': currentMapZoom}
            )
        );
    },

    updateMarkerIcon() {
        var html = MapUi.buildLayerHtmlIcon( this.model );

        this.ui.markerWrapper.html( html );
    },

    onClickEditMarker() {
        this._radio.commands.execute( 'modal:showEditPoiMarker', this.model );
    },

    onSubmit(e) {
        e.preventDefault();

        let updateMarkers = false;
        let updateMinZoom = false;
        let updatePopups = false;
        let updateVisibility = false;
        let updateRequest = false;
        let updateCache = false;
        const color = this.model.get('markerColor');

        if (color === 'dark-gray') {
            this.model.set('color', 'anthracite');
        }
        else {
            this.model.set('color', color);
        }

        this.model.set('name', this.ui.layerName.val());
        this.model.set('description', this.ui.layerDescription.val());
        this.model.set('visible', this.ui.layerVisible.prop('checked'));
        this.model.set('dataEditable', this.ui.layerDataEditable.prop('checked'));
        this.model.set('minZoom', parseInt( this.ui.layerMinZoom.val() ));
        this.model.set('overpassRequest', this.ui.layerOverpassRequest.val());
        this.model.set('popupContent', this.ui.layerPopupContent.val());
        this.model.set('cache', this.ui.layerCache.prop('checked'));

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

        if ( !this.model.get('cache') ) {
            if ( this._oldModel.get('overpassRequest') !== this.model.get('overpassRequest') ) {
                updateRequest = true;
            }
        }

        if ( this.model.get('cache') ) {
            if ( !this._oldModel.get('cache') ) {
                updateCache = true;
            }

            if ( this._oldModel.get('overpassRequest') !== this.model.get('overpassRequest') ) {
                updateCache = true;
            }
        }

        if ( this.options.isNew ) {
            this.options.theme.get('layers').add( this.model );
        }

        this.model.updateModificationDate();
        this.options.theme.updateModificationDate();
        this.options.theme.save({}, {
            success: () => {
                if ( this.options.isNew ) {
                    this._radio.commands.execute('map:addLayer', this.model);
                }
                else {
                    if ( updateMinZoom ) {
                        this._radio.commands.execute('map:updateLayerMinZoom', this.model);
                    }

                    if ( updateMarkers ) {
                        this._radio.commands.execute('map:updateLayerStyles', this.model);
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

                    if ( updateRequest ) {
                        this._radio.commands.execute('layer:updateOverPassRequest', this.model);
                    }

                    if ( updateCache ) {
                        const layerUuid = this.model.get('uniqid');
                        const xhr = new XMLHttpRequest();
                        xhr.open('GET', `${CONST.apiPath}overPassCache/generate/${layerUuid}`, true);
                        xhr.send();
                    }
                }

                this.close();
            },
            error: () => {
                // FIXME
                console.error('nok');
            },
        });
    },

    onReset() {
        this.model.set( this._oldModel.toJSON() );

        this.ui.column.one('transitionend', this.render);

        this.close();
    },
});


import moment from 'moment-timezone';
import Locale from 'core/locale';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from 'ui/map';
import template from 'templates/admin/layer/editOverPassColumn.ejs';
import CONST from 'const';
import MarkedHelper from 'helper/marked';
import EditMarkerModal from 'view/admin/layer/editMarkerModal';


export default Marionette.ItemView.extend({
    template,

    behaviors() {
        return {
            l20n: {},
            column: {
                appendToBody: true,
                destroyOnClose: true,
                routeOnClose: this.options.routeOnClose,
                triggerRouteOnClose: this.options.triggerRouteOnClose,
            },
        };
    },

    ui: {
        column: '.column',
        submitButton: '.submit_btn',

        layerName: '#layer_name',
        layerDescription: '#layer_description',
        layerCluster: '#layer_cluster',
        layerHeat: '#layer_heat',
        layerVisible: '#layer_visible',
        layerMinZoom: '#layer_min_zoom',
        overPassInfo: '.info_overpass_btn',
        layerOverpassRequest: '#layer_overpass_request',
        layerPopupContent: '#layer_popup_content',
        infoDisplayInfo: '.info_info_display_btn',
        layerCache: '#layer_cache',

        heatOptions: '.heat-options',
        heatMapInfo: '.info_heat_map_btn',
        heatMinOpacity: '#layer_heat_min_opacity',
        heatMaxZoom: '#layer_heat_max_zoom',
        heatMax: '#layer_heat_max',
        heatBlur: '#layer_heat_blur',
        heatRadius: '#layer_heat_radius',

        markerOptions: '.marker-options',
        markerWrapper: '.marker-wrapper',
        editMarkerButton: '.edit_marker_btn',
        currentMapZoom: '.current_map_zoom',
        cacheSection: '.cache_section',
        cacheInfo: '.info_cache_btn',
        cacheDate: '.cache_date',
        cacheErrorTimeout: '.cache_error_timeout',
        cacheErrorMemory: '.cache_error_memory',
        cacheErrorBadRequest: '.cache_error_bad_request',
        cacheErrorUnknown: '.cache_error_unknown',
    },

    events: {
        'change @ui.layerCluster': 'onChangeLayerRepresentation',
        'change @ui.layerHeat': 'onChangeLayerRepresentation',
        'click @ui.editMarkerButton': 'onClickEditMarker',
        submit: 'onSubmit',
        reset: 'onReset',
    },

    templateHelpers() {
        return {
            marker: MapUi.buildLayerHtmlIcon( this.model ),
        };
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();

        this.listenTo(this.model, 'change', this.updateMarkerIcon);
        this._radio.vent.on('map:zoomChanged', this.onChangedMapZoom, this);
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    onRender() {
        this.ui.layerVisible.prop('checked', this.model.get('visible'));
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

        if ( this.model.get('rootLayerType') === CONST.rootLayerType.heat ) {
            this.ui.layerHeat.prop('checked', true);
            this.hideMarkerOptions();
            this.showHeatOptions();
        }
        else {
            this.ui.layerCluster.prop('checked', true);
        }

        this.ui.heatMapInfo.popover({
            container: 'body',
            placement: 'left',
            trigger: 'focus',
            html: true,
            title: document.l10n.getSync('editLayerFormColumn_heatMapPopoverTitle'),
            content: MarkedHelper.render(
                document.l10n.getSync('editLayerFormColumn_heatMapPopoverContent')
            ),
        });

        this.ui.infoDisplayInfo.popover({
            container: 'body',
            placement: 'left',
            trigger: 'focus',
            html: true,
            title: document.l10n.getSync('editLayerFormColumn_infoDisplayPopoverTitle'),
            content: MarkedHelper.render(
                document.l10n.getSync('editLayerFormColumn_infoDisplayPopoverContent')
            ),
        });

        this.ui.overPassInfo.popover({
            container: 'body',
            placement: 'left',
            trigger: 'focus',
            html: true,
            title: document.l10n.getSync('editLayerFormColumn_overPassPopoverTitle'),
            content: MarkedHelper.render(
                document.l10n.getSync('editLayerFormColumn_overPassPopoverContent')
            ),
        });

        this.ui.cacheInfo.popover({
            container: 'body',
            placement: 'left',
            trigger: 'focus',
            html: true,
            title: document.l10n.getSync('editLayerFormColumn_cachePopoverTitle'),
            content: MarkedHelper.render(
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
        const currentMapZoom = this._radio.reqres.request('map:currentZoom');

        this.ui.currentMapZoom.html(
            document.l10n.getSync(
                'editLayerFormColumn_currentMapZoom', { currentMapZoom }
            )
        );
    },

    onChangeLayerRepresentation() {
        if ( this.ui.layerCluster.prop('checked') ) {
            this.hideHeatOptions();
            this.showMarkerOptions();
        }
        else {
            this.hideMarkerOptions();
            this.showHeatOptions();
        }
    },

    showHeatOptions() {
        this.ui.heatOptions.removeClass('hide');
    },

    hideHeatOptions() {
        this.ui.heatOptions.addClass('hide');
    },

    showMarkerOptions() {
        this.ui.markerOptions.removeClass('hide');
    },

    hideMarkerOptions() {
        this.ui.markerOptions.addClass('hide');
    },

    updateMarkerIcon() {
        const html = MapUi.buildLayerHtmlIcon( this.model );

        this.ui.markerWrapper.html( html );
    },

    onClickEditMarker() {
        new EditMarkerModal({
            model: this.model,
        }).open();
    },

    enableSubmitButton() {
        this.ui.submitButton.prop('disabled', false);
    },

    disableSubmitButton() {
        this.ui.submitButton.prop('disabled', true);
    },

    onSubmit(e) {
        e.preventDefault();

        this.disableSubmitButton();

        let updateRequest = false;
        let updateCache = false;

        this.model.set('name', this.ui.layerName.val());
        this.model.set('description', this.ui.layerDescription.val());
        this.model.set('visible', this.ui.layerVisible.prop('checked'));
        this.model.set('minZoom', parseInt(this.ui.layerMinZoom.val(), 10));
        this.model.set('overpassRequest', this.ui.layerOverpassRequest.val());
        this.model.set('popupContent', this.ui.layerPopupContent.val());
        this.model.set('cache', this.ui.layerCache.prop('checked'));
        this.model.set('heatMinOpacity', parseFloat(this.ui.heatMinOpacity.val()));
        this.model.set('heatMaxZoom', parseInt(this.ui.heatMaxZoom.val(), 10));
        this.model.set('heatMax', parseFloat(this.ui.heatMax.val()));
        this.model.set('heatBlur', parseInt(this.ui.heatBlur.val(), 10));
        this.model.set('heatRadius', parseInt(this.ui.heatRadius.val(), 10));

        if ( this.ui.layerCluster.prop('checked') ) {
            this.model.set('rootLayerType', CONST.rootLayerType.markerCluster);
        }
        else {
            this.model.set('rootLayerType', CONST.rootLayerType.heat);
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
                MapUi.updateLayerDisplayFromOlderModel(
                    this.model,
                    this._oldModel,
                    this.options.isNew
                );

                if ( !this.options.isNew ) {
                    if ( updateRequest ) {
                        this._radio.commands.execute('layer:updateOverPassRequest', this.model);
                    }

                    if ( updateCache ) {
                        const layerUuid = this.model.get('uuid');
                        const xhr = new XMLHttpRequest();
                        xhr.open('GET', `${CONST.apiPath}/overPassCache/generate/${layerUuid}`, true);
                        xhr.send();
                    }
                }

                this.close();
            },
            error: () => {
                // FIXME
                console.error('nok');
                this.enableSubmitButton();
            },
        });
    },

    onReset() {
        this.model.set( this._oldModel.toJSON() );

        this.close();
    },
});

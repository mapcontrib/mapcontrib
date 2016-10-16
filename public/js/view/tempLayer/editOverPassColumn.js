
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from 'ui/map';
import template from 'templates/tempLayer/editOverPassColumn.ejs';
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
        layerMinZoom: '#layer_min_zoom',
        overPassInfo: '.info_overpass_btn',
        layerOverpassRequest: '#layer_overpass_request',
        layerPopupContent: '#layer_popup_content',
        infoDisplayInfo: '.info_info_display_btn',

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

    onRender() {
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
    },

    onDestroy() {
        this._radio.vent.off('map:zoomChanged', this.onChangedMapZoom);
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
        const color = this.model.get('markerColor');

        if (color === 'dark-gray') {
            this.model.set('color', 'anthracite');
        }
        else {
            this.model.set('color', color);
        }

        this.model.set('name', this.ui.layerName.val());
        this.model.set('description', this.ui.layerDescription.val());
        this.model.set('minZoom', parseInt(this.ui.layerMinZoom.val(), 10));
        this.model.set('overpassRequest', this.ui.layerOverpassRequest.val());
        this.model.set('popupContent', this.ui.layerPopupContent.val());
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

        if ( this._oldModel.get('overpassRequest') !== this.model.get('overpassRequest') ) {
            updateRequest = true;
        }

        if ( this.options.isNew ) {
            this.collection.add( this.model );
            this._radio.commands.execute('map:addTempLayer', this.model);
        }
        else {
            MapUi.updateLayerStyleFromOlderModel(
                this.model,
                this._oldModel
            );

            if ( updateRequest ) {
                this._radio.commands.execute('layer:updateOverPassRequest', this.model);
            }
        }

        this.close();
    },

    onReset() {
        this.model.set( this._oldModel.toJSON() );

        this.ui.column.one('transitionend', this.render);

        this.close();
    },
});

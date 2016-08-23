
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from '../ui/map';
import { basename, extensionname, formatBytes } from '../core/utils';
import CONST from '../const';
import template from '../../templates/editGeoJsonLayerFormColumn.ejs';
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
        'form': 'form',
        'submitButton': '.submit_btn',

        'layerName': '#layer_name',
        'layerDescription': '#layer_description',
        'layerCluster': '#layer_cluster',
        'layerHeat': '#layer_heat',
        'layerVisible': '#layer_visible',
        'infoDisplayInfo': '.info_info_display_btn',
        'layerPopupContent': '#layer_popup_content',
        'layerFile': '#layer_file',

        'heatOptions': '.heat-options',
        'heatMapInfo': '.info_heat_map_btn',
        'heatMinOpacity': '#layer_heat_min_opacity',
        'heatMaxZoom': '#layer_heat_max_zoom',
        'heatMax': '#layer_heat_max',
        'heatBlur': '#layer_heat_blur',
        'heatRadius': '#layer_heat_radius',

        'markerOptions': '.marker-options',
        'markerWrapper': '.marker-wrapper',
        'editMarkerButton': '.edit_marker_btn',

        'formGroups': '.form-group',
        'fileFormGroup': '.form-group.layer_file',

        'currentFile': '.current_file',
    },

    events: {
        'change @ui.layerCluster': 'onChangeLayerRepresentation',
        'change @ui.layerHeat': 'onChangeLayerRepresentation',
        'click @ui.editMarkerButton': 'onClickEditMarker',
        'submit': 'onSubmit',
        'reset': 'onReset',
    },

    templateHelpers() {
        const config = MAPCONTRIB.config;
        const maxFileSize = formatBytes( config.uploadMaxShapeFileSize * 1024 );

        return {
            'marker': MapUi.buildLayerHtmlIcon( this.model ),
            'fragment': this.options.theme.get('fragment'),
            'apiPath': `${CONST.apiPath}file/shape`,
            'maxFileSize': document.l10n.getSync('maxFileSize', {maxFileSize}),
        };
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();

        this.listenTo(this.model, 'change', this.updateMarkerIcon);
    },

    onRender() {
        this.ui.layerVisible.prop('checked', this.model.get('visible'));

        if ( this.model.get('fileUri') ) {
            const fileUri = this.model.get('fileUri');
            const fileName = basename(fileUri || '');

            this.ui.currentFile
            .html(
                document.l10n.getSync('currentFile', {
                    file: `<a href="${fileUri}" target="_blank">${fileName}</a>`
                })
            )
            .removeClass('hide');
        }

        if ( this.model.get('rootLayerType') === CONST.rootLayerType.heat ) {
            this.ui.layerHeat.prop('checked', true);
            this.hideMarkerOptions();
            this.showHeatOptions();
        }
        else {
            this.ui.layerCluster.prop('checked', true);
        }
    },

    onShow() {
        this.ui.heatMapInfo.popover({
            'container': 'body',
            'placement': 'left',
            'trigger': 'focus',
            'html': true,
            'title': document.l10n.getSync('editLayerFormColumn_heatMapPopoverTitle'),
            'content': MarkedHelper.render(
                document.l10n.getSync('editLayerFormColumn_heatMapPopoverContent')
            ),
        });

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

        this.ui.layerFile.filestyle({
            'icon': false,
            'badge': false,
            'buttonText': document.l10n.getSync('editLayerFormColumn_browse'),
        });
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
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
        this._radio.commands.execute( 'modal:showEditPoiMarker', this.model );
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

        this.ui.formGroups.removeClass('has-feedback has-error');

        const fileName = this.ui.layerFile.val();

        if ( !fileName && this.options.isNew ) {
            this.ui.fileFormGroup.addClass('has-feedback has-error');
            this.enableSubmitButton();
            return false;
        }
        else if ( fileName ) {
            const extension = extensionname(fileName).toLowerCase();

            if (extension !== 'geojson') {
                this.ui.fileFormGroup.addClass('has-feedback has-error');
                this.enableSubmitButton();
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
                    this.enableSubmitButton();
                },
                'success': response => {
                    const file = response[0];
                    this.model.set('fileUri', file.layer_file);
                    this.saveLayer();
                }
            });
        }
        else {
            this.saveLayer();
        }
    },

    saveLayer() {
        const color = this.model.get('markerColor');

        if (color === 'dark-gray') {
            this.model.set('color', 'anthracite');
        }
        else {
            this.model.set('color', color);
        }

        this.model.set('minZoom', 0);
        this.model.set('name', this.ui.layerName.val());
        this.model.set('description', this.ui.layerDescription.val());
        this.model.set('visible', this.ui.layerVisible.prop('checked'));
        this.model.set('popupContent', this.ui.layerPopupContent.val());
        this.model.set('heatMinOpacity', parseFloat(this.ui.heatMinOpacity.val()));
        this.model.set('heatMaxZoom', parseInt(this.ui.heatMaxZoom.val()));
        this.model.set('heatMax', parseFloat(this.ui.heatMax.val()));
        this.model.set('heatBlur', parseInt(this.ui.heatBlur.val()));
        this.model.set('heatRadius', parseInt(this.ui.heatRadius.val()));

        if ( this.ui.layerCluster.prop('checked') ) {
            this.model.set('rootLayerType', CONST.rootLayerType.markerCluster);
        }
        else {
            this.model.set('rootLayerType', CONST.rootLayerType.heat);
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

        this.ui.column.one('transitionend', this.render);

        this.close();
    },
});

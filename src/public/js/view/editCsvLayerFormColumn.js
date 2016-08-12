
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from '../ui/map';
import { basename, extensionname, formatBytes } from '../core/utils';
import CONST from '../const';
import template from '../../templates/editCsvLayerFormColumn.ejs';
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

        'layerName': '#layer_name',
        'layerDescription': '#layer_description',
        'layerVisible': '#layer_visible',
        'infoDisplayInfo': '.info_info_display_btn',
        'layerPopupContent': '#layer_popup_content',
        'layerFile': '#layer_file',

        'markerWrapper': '.marker-wrapper',
        'editMarkerButton': '.edit_marker_btn',

        'formGroups': '.form-group',
        'fileFormGroup': '.form-group.layer_file',

        'currentFile': '.current_file',
    },

    events: {
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

    updateMarkerIcon() {
        var html = MapUi.buildLayerHtmlIcon( this.model );

        this.ui.markerWrapper.html( html );
    },

    onClickEditMarker() {
        this._radio.commands.execute( 'modal:showEditPoiMarker', this.model );
    },

    onSubmit(e) {
        e.preventDefault();

        this.ui.formGroups.removeClass('has-feedback has-error');

        const fileName = this.ui.layerFile.val();

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
        let updateMarkers = false;
        let updatePopups = false;
        let updateVisibility = false;

        this.model.set('minZoom', 0);
        this.model.set('name', this.ui.layerName.val());
        this.model.set('description', this.ui.layerDescription.val());
        this.model.set('visible', this.ui.layerVisible.prop('checked'));
        this.model.set('popupContent', this.ui.layerPopupContent.val());

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

        this.model.updateModificationDate();
        this.options.theme.updateModificationDate();
        this.options.theme.save({}, {
            success: () => {
                if ( this.options.isNew ) {
                    this._radio.commands.execute('map:addLayer', this.model);
                }
                else {
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

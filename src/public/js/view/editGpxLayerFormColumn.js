
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from '../ui/map';
import { basename, extensionname } from '../core/utils';
import CONST from '../const';
import ColorSelectorView from '../ui/form/colorSelector';
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

        'colorSelector': '.color_selector',

        'formGroups': '.form-group',
        'fileFormGroup': '.form-group.layer_file',

        'actualFile': '.actual_file',
    },

    events: {
        'submit': 'onSubmit',
        'reset': 'onReset',
    },

    templateHelpers: function () {
        const config = MAPCONTRIB.config;
        const maxFileSize = Math.round( config.uploadMaxShapeFileSize / 1024 );
        const file = basename(this.model.get('fileUri') || '');

        return {
            'fragment': this.options.theme.get('fragment'),
            'apiPath': `${CONST.apiPath}file/shape`,
            'maxFileSize': document.l10n.getSync('maxFileSize', {maxFileSize}),
            'file': file
        };
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();

        this._colorSelector = new ColorSelectorView({
            'color': this.model.get('color')
        });
    },

    onRender: function () {
        this.ui.colorSelector.append(
            this._colorSelector.el
        );

        this.ui.layerVisible.prop('checked', this.model.get('visible'));

        if ( this.model.get('fileUri') ) {
            this.ui.actualFile.removeClass('hide');
        }
    },

    onShow: function () {
        this.ui.layerFile.filestyle({
            'icon': false,
            'badge': false,
            'buttonText': document.l10n.getSync('editLayerFormColumn_browse'),
        });
    },

    open: function () {
        this.triggerMethod('open');
    },

    close: function () {
        this.triggerMethod('close');
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

            if (extension !== 'gpx') {
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
        let updatePolylines = false,
        updatePopups = false,
        updateVisibility = false;

        this.model.set('minZoom', 0);
        this.model.set('name', this.ui.layerName.val());
        this.model.set('description', this.ui.layerDescription.val());
        this.model.set('color', this._colorSelector.getSelectedColor());
        this.model.set('visible', this.ui.layerVisible.prop('checked'));
        this.model.set('popupContent', this.ui.layerPopupContent.val());

        if ( this._oldModel.get('color') !== this.model.get('color') ) {
            updatePolylines = true;
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

        this.options.theme.set('modificationTimestamp', new Date().toISOString());
        this.options.theme.save({}, {
            'success': () => {
                if ( this.options.isNew ) {
                    this._radio.commands.execute('map:addLayer', this.model);
                }
                else {
                    if ( updatePolylines ) {
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

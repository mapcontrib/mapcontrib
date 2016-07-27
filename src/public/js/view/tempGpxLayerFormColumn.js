
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from '../ui/map';
import { basename, extensionname } from '../core/utils';
import CONST from '../const';
import ColorSelectorView from '../ui/form/colorSelector';
import template from '../../templates/tempGpxLayerFormColumn.ejs';


export default Marionette.ItemView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'column': {
            'destroyOnClose': true,
        },
    },

    ui: {
        'column': '#edit_temp_layer_column',
        'form': 'form',

        'layerName': '#layer_name',
        'layerDescription': '#layer_description',
        'layerPopupContent': '#layer_popup_content',
        'layerFile': '#layer_file',

        'colorSelector': '.color_selector',

        'formGroups': '.form-group',
        'fileFormGroup': '.form-group.layer_file',

        'currentFile': '.current_file',
    },

    events: {
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

        this._colorSelector = new ColorSelectorView({
            'color': this.model.get('color')
        });
    },

    onRender: function () {
        this.ui.colorSelector.append(
            this._colorSelector.el
        );

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

    onShow: function () {
        this.ui.layerFile.filestyle({
            'icon': false,
            'badge': false,
            'buttonText': document.l10n.getSync('editLayerFormColumn_browse'),
        });
    },

    open: function () {
        this.triggerMethod('open');
        return this;
    },

    close: function () {
        this.triggerMethod('close');
        return this;
    },

    onSubmit: function (e) {
        e.preventDefault();

        this.ui.formGroups.removeClass('has-feedback has-error');

        const fileName = this.ui.layerFile.val();

        if ( !fileName && this.options.isNew ) {
            this.ui.fileFormGroup.addClass('has-feedback has-error');
            return false;
        }
        else if ( fileName ) {
            const extension = extensionname(fileName).toLowerCase();

            if (extension !== 'gpx') {
                this.ui.fileFormGroup.addClass('has-feedback has-error');
                return false;
            }
        }


        let updatePolylines = false;
        let updatePopups = false;

        this.model.set('minZoom', 0);
        this.model.set('name', this.ui.layerName.val());
        this.model.set('description', this.ui.layerDescription.val());
        this.model.set('color', this._colorSelector.getSelectedColor());
        this.model.set('popupContent', this.ui.layerPopupContent.val());

        if ( this._oldModel.get('color') !== this.model.get('color') ) {
            updatePolylines = true;
        }

        if ( this._oldModel.get('popupContent') !== this.model.get('popupContent') ) {
            updatePopups = true;
        }

        if ( this.options.isNew ) {
            this.collection.add( this.model );
        }
        else {
            if ( updatePolylines ) {
                this._radio.commands.execute('map:updateLayerStyles', this.model);
            }

            if ( updatePopups ) {
                this._radio.commands.execute('map:updateLayerPopups', this.model);
            }
        }

        if ( fileName ) {
            if ( !this.options.isNew ) {
                this._radio.commands.execute('map:removeLayer', this.model);
            }

            const reader = new FileReader();

            reader.onload = () => {
                const fileContent = reader.result;
                this._radio.commands.execute('map:addTempLayer', this.model, fileContent);
            };

            reader.readAsText( this.ui.layerFile.get(0).files[0] );
        }

        this.close();
    },

    onReset: function () {
        this.model.set( this._oldModel.toJSON() );

        this.ui.column.one('transitionend', this.render);

        this.close();
    },
});


import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from 'ui/map';
import { basename, extensionname } from 'core/utils';
import CONST from 'const';
import ColorSelectorView from 'ui/form/colorSelector';
import template from 'templates/tempGpxLayerFormColumn.ejs';
import MarkedHelper from 'helper/marked';


export default Marionette.ItemView.extend({
    template,

    behaviors: {
        l20n: {},
        column: {
            destroyOnClose: true,
        },
    },

    ui: {
        column: '#edit_temp_layer_column',
        'form': 'form',
        'submitButton': '.submit_btn',

        'layerName': '#layer_name',
        'layerDescription': '#layer_description',
        'infoDisplayInfo': '.info_info_display_btn',
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

    templateHelpers() {
        return {
            'marker': MapUi.buildLayerHtmlIcon( this.model ),
        };
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();

        this._colorSelector = new ColorSelectorView({
            'color': this.model.get('color')
        });
    },

    onRender() {
        this.ui.colorSelector.append(
            this._colorSelector.el
        );

        if ( this.model.get('fileUri') ) {
            const fileUri = this.model.get('fileUri');
            const fileName = basename(fileUri || '');

            this.ui.currentFile
            .html(
                document.l10n.getSync('currentFile', {
                    file: `<a href="${fileUri}" rel="noopener noreferrer" target="_blank">${fileName}</a>`
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

            if (extension !== 'gpx') {
                this.ui.fileFormGroup.addClass('has-feedback has-error');
                this.enableSubmitButton();
                return false;
            }
        }

        this.model.set('minZoom', 0);
        this.model.set('name', this.ui.layerName.val());
        this.model.set('description', this.ui.layerDescription.val());
        this.model.set('color', this._colorSelector.getSelectedColor());
        this.model.set('popupContent', this.ui.layerPopupContent.val());

        if ( this.options.isNew ) {
            this.collection.add( this.model );
        }
        else {
            MapUi.updateLayerStyleFromOlderModel(
                this.model,
                this._oldModel
            );
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

    onReset() {
        this.model.set( this._oldModel.toJSON() );

        this.ui.column.one('transitionend', this.render);

        this.close();
    },
});


import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MapUi from 'ui/map';
import { basename, extensionname, formatBytes } from 'core/utils';
import CONST from 'const';
import ColorSelectorView from 'ui/form/colorSelector';
import template from 'templates/admin/layer/editGpxColumn.ejs';
import MarkedHelper from 'helper/marked';


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
        form: 'form',
        submitButton: '.submit_btn',

        layerName: '#layer_name',
        layerDescription: '#layer_description',
        layerVisible: '#layer_visible',
        infoDisplayInfo: '.info_info_display_btn',
        layerPopupContent: '#layer_popup_content',
        layerFile: '#layer_file',

        colorSelector: '.color_selector',

        formGroups: '.form-group',
        fileFormGroup: '.form-group.layer_file',

        currentFile: '.current_file',
    },

    events: {
        submit: 'onSubmit',
        reset: 'onReset',
    },

    templateHelpers() {
        const config = MAPCONTRIB.config;
        const maxFileSize = formatBytes( config.uploadMaxShapeFileSize * 1024 );

        return {
            fragment: this.options.theme.get('fragment'),
            apiPath: `${CONST.apiPath}/file/shape`,
            maxFileSize: document.l10n.getSync('maxFileSize', { maxFileSize }),
        };
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();

        this._colorSelector = new ColorSelectorView({
            color: this.model.get('color'),
        });
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    onRender() {
        this.ui.colorSelector.append(
            this._colorSelector.el
        );

        this.ui.layerVisible.prop('checked', this.model.get('visible'));

        if ( this.model.get('fileUri') ) {
            const fileUri = this.model.get('fileUri');
            const fileName = basename(fileUri || '');

            this.ui.currentFile
            .html(
                document.l10n.getSync('currentFile', {
                    file: `<a href="${fileUri}" rel="noopener noreferrer" target="_blank">${fileName}</a>`,
                })
            )
            .removeClass('hide');
        }

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

        this.ui.layerFile.filestyle({
            icon: false,
            badge: false,
            buttonText: document.l10n.getSync('editLayerFormColumn_browse'),
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

            this.ui.form.ajaxSubmit({
                error: (xhr) => {
                    switch (xhr.status) {
                        case 413:
                            this.ui.fileFormGroup.addClass('has-feedback has-error');
                            break;
                        case 415:
                            this.ui.fileFormGroup.addClass('has-feedback has-error');
                            break;
                        default:
                            this.ui.formGroups.addClass('has-feedback has-error');
                    }
                    this.enableSubmitButton();
                },
                success: (response) => {
                    const file = response[0];
                    this.model.set('fileUri', file.layer_file);
                    this.saveLayer();
                },
            });
        }
        else {
            this.saveLayer();
        }

        return true;
    },

    saveLayer() {
        this.model.set('minZoom', 0);
        this.model.set('name', this.ui.layerName.val());
        this.model.set('description', this.ui.layerDescription.val());
        this.model.set('color', this._colorSelector.getSelectedColor());
        this.model.set('visible', this.ui.layerVisible.prop('checked'));
        this.model.set('popupContent', this.ui.layerPopupContent.val());

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

        this.close();
    },
});

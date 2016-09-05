
import Marionette from 'backbone.marionette';
import template from './template.ejs';
import CONST from '../../../../const';
import { formatBytes, basename } from '../../../../core/utils';


export default Marionette.ItemView.extend({
    template: template,

    ui: {
        'input': '.filestyle',
        'currentFile': '.current_file',
        'removeBtn': '.remove_btn',
    },

    events: {
        'blur @ui.input': 'updateInput',
        'keyup @ui.input': 'updateInput',
        'click @ui.removeBtn': 'onClickRemoveBtn',
    },

    templateHelpers() {
        const config = MAPCONTRIB.config;
        const maxFileSize = formatBytes( config.uploadMaxNonOsmDataFileSize * 1024 );

        return {
            cid: this.model.cid,
            maxFileSize: document.l10n.getSync('maxFileSize', {maxFileSize}),
        };
    },

    onRender() {
        document.l10n.localizeNode( this.el );

        if ( this.model.get('value') ) {
            const fileUri = this.model.get('value');
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
        this.ui.input.filestyle({
            'icon': false,
            'badge': false,
            'placeholder': document.l10n.getSync('file'),
            'buttonText': document.l10n.getSync('editLayerFormColumn_browse'),
        });
    },

    isNotEmpty() {
        if ( this.ui.input.val() ) {
            return true;
        }

        return false;
    },

    updateInput(e) {
        this.model.set(
            'value',
            this.ui.input.val().trim()
        );
    },

    onClickRemoveBtn(e) {
        this.model.destroy();
    },

    enable() {
        this.ui.input.prop('disabled', false);
    },

    disable() {
        this.ui.input.prop('disabled', true);
    },

    enableRemoveBtn() {
        this.ui.removeBtn.prop('disabled', false);
    },

    disableRemoveBtn() {
        this.ui.removeBtn.prop('disabled', true);
    },
});

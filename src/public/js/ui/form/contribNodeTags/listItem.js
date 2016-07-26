
import Marionette from 'backbone.marionette';
import listItemTemplate from './listItem.ejs';


export default Marionette.ItemView.extend({
    template: listItemTemplate,

    ui: {
        'key': '.key',
        'textInput': '.text_input',
        'fileInput': '.file_input',
        'textInputGroup': '.text_input_group',
        'fileInputGroup': '.file_input_group',
        'currentFile': '.current_file',
        'infoBtn': '.info_btn',
        'nonOsmWarning': '.non_osm_warning',
        'removeBtn': '.remove_btn',
    },

    events: {
        'blur @ui.key': 'updateKey',
        'blur @ui.textInput': 'updateTextInput',
        'keyup @ui.key': 'updateKey',
        'keyup @ui.textInput': 'updateTextInput',
        'click @ui.removeBtn': 'onClickRemoveBtn',
    },

    initialize: function () {
        this.listenTo(this.model.collection, 'sync', this.onCollectionUpdate);
        this.listenTo(this.model.collection, 'reset', this.onCollectionUpdate);
        this.listenTo(this.model.collection, 'update', this.onCollectionUpdate);
    },

    templateHelpers: function () {
        const config = MAPCONTRIB.config;
        const maxFileSize = Math.round( config.uploadMaxShapeFileSize / 1024 );

        return {
            'cid': this.model.cid,
            'maxFileSize': document.l10n.getSync('maxFileSize', {maxFileSize}),
        };
    },

    onRender: function () {
        document.l10n.localizeNode( this.el );

        if (this.model.get('keyReadOnly')) {
            this.ui.key.prop('disabled', 'disabled');
        }

        if (this.model.get('valueReadOnly')) {
            this.ui.textInput.prop('disabled', 'disabled');
        }

        if (this.model.get('keyReadOnly') || this.model.get('valueReadOnly')) {
            this.ui.removeBtn.prop('disabled', true);
        }

        if (this.model.get('nonOsmData')) {
            this.ui.nonOsmWarning.removeClass('hide');
        }

        if (this.model.get('type') === 'text') {
            this.ui.textInputGroup.removeClass('hide');
            this.ui.fileInputGroup.addClass('hide');
        }
        else {
            if ( this.model.get('value') ) {
                const fileUri = this.model.get('value');
                const fileName = basename(fileUri || '');

                this.ui.currentFile
                .html(
                    document.l10n.getSync('currentFile', {
                        file: `<a href="${fileUri}" target="_blank">${fileName}</a>`
                    })
                )
                .removeClass('hide');
            }

            this.ui.textInputGroup.addClass('hide');
            this.ui.fileInputGroup.removeClass('hide');
        }

        this.renderTagInfo();

        this.onCollectionUpdate();
    },

    onShow: function () {
        this.ui.fileInput.filestyle({
            'icon': false,
            'badge': false,
            'placeholder': document.l10n.getSync('file'),
            'buttonText': document.l10n.getSync('editLayerFormColumn_browse'),
        });
    },

    renderTagInfo: function () {
        const key = this.ui.key.val().trim();
        const taginfoServiceHost = MAPCONTRIB.config.taginfoServiceHost;

        this.ui.infoBtn.attr('href', `${taginfoServiceHost}/keys/${key}`);
    },

    updateKey: function (e) {
        const key = this.ui.key.val().trim();

        this.model.set( 'key', key );

        this.renderTagInfo();
    },

    updateTextInput: function (e) {
        this.model.set(
            'value',
            this.ui.textInput.val().trim()
        );
    },

    onClickRemoveBtn: function (e) {
        this.model.destroy();
    },

    onCollectionUpdate: function () {
        const osmTags = this.model.collection.where({
            'nonOsmData': false
        });

        if (osmTags.length === 1) {
            this.ui.removeBtn.prop('disabled', true);
        }
        else {
            if ( !this.model.get('nonOsmData') ) {
                this.ui.removeBtn.prop('disabled', false);
            }
        }
    },
});

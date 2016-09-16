
import Marionette from 'backbone.marionette';
import CONST from 'const';
import listItemTemplate from './listItem.ejs';


export default Marionette.ItemView.extend({
    template: listItemTemplate,

    ui: {
        key: '.key',
        value: '.value',
        keyReadOnly: '.key_read_only',
        valueReadOnly: '.value_read_only',
        nonOsmData: '.non_osm_data',
        textInput: '.text_input',
        fileInput: '.file_input',
        keyReadOnlyGroup: '.key_read_only_group',
        valueReadOnlyGroup: '.value_read_only_group',
        textInputGroup: '.text_input_group',
        fileInputGroup: '.file_input_group',
        tagInfoBtn: '.tag_info_btn',
        removeBtn: '.remove_btn',
    },

    events: {
        'blur @ui.key': 'updateKey',
        'blur @ui.value': 'updateValue',
        'keyup @ui.key': 'updateKey',
        'keyup @ui.value': 'updateValue',
        'change @ui.keyReadOnly': 'onChangeKeyReadOnly',
        'change @ui.valueReadOnly': 'onChangeValueReadOnly',
        'change @ui.nonOsmData': 'onChangeNonOsmData',
        'change @ui.textInput': 'onChangetypeInput',
        'change @ui.fileInput': 'onChangetypeInput',
        'click @ui.removeBtn': 'onClickRemoveBtn',
    },

    initialize() {
        this.listenTo(this.model.collection, 'sync', this.onCollectionUpdate);
        this.listenTo(this.model.collection, 'reset', this.onCollectionUpdate);
        this.listenTo(this.model.collection, 'update', this.onCollectionUpdate);
        this.listenTo(this.model.collection, 'change', this.onCollectionUpdate);
    },

    templateHelpers() {
        return {
            cid: this.model.cid
        };
    },

    onRender() {
        document.l10n.localizeNode( this.el );

        this.ui.nonOsmData.prop(
            'checked',
            this.model.get('nonOsmData')
        );

        this.ui.keyReadOnly.prop(
            'checked',
            this.model.get('keyReadOnly')
        );

        this.ui.valueReadOnly.prop(
            'checked',
            this.model.get('valueReadOnly')
        );

        if ( this.model.get('type') === CONST.tagType.text ) {
            this.ui.textInput.prop('checked', true);
        }
        else {
            this.ui.fileInput.prop('checked', true);
        }

        this.onChangeValueReadOnly();
        this.onChangeKeyReadOnly();
        this.onChangeNonOsmData();

        this.renderTagInfo();

        this.onCollectionUpdate();
    },

    renderTagInfo() {
        const key = this.ui.key.val().trim();
        const taginfoServiceHost = MAPCONTRIB.config.taginfoServiceHost;

        this.ui.tagInfoBtn.attr('href', `${taginfoServiceHost}/keys/${key}`);
    },

    updateKey(e) {
        const key = this.ui.key.val().trim();

        this.model.set( 'key', key );

        this.renderTagInfo();
    },

    updateValue(e) {
        this.model.set(
            'value',
            this.ui.value.val().trim()
        );
    },

    onChangeKeyReadOnly(e) {
        this.model.set('keyReadOnly', this.ui.keyReadOnly.prop('checked'));

        this.ui.valueReadOnly.prop(
            'disabled',
            !this.model.get('keyReadOnly')
        );

        if ( !this.model.get('keyReadOnly') ) {
            this.ui.valueReadOnly.prop('checked', false);
        }
    },

    onChangeValueReadOnly(e) {
        this.model.set('valueReadOnly', this.ui.valueReadOnly.prop('checked'));
    },

    onChangeNonOsmData(e) {
        this.model.set('nonOsmData', this.ui.nonOsmData.prop('checked'));

        const nonOsmData = this.model.get('nonOsmData');

        if (nonOsmData) {
            this.ui.keyReadOnly
            .prop('checked', true)
            .prop('disabled', true);

            this.ui.valueReadOnly
            .prop('checked', false)
            .prop('disabled', true);

            this.ui.textInputGroup.removeClass('hide');
            this.ui.fileInputGroup.removeClass('hide');
            this.ui.keyReadOnlyGroup.addClass('hide');
            this.ui.valueReadOnlyGroup.addClass('hide');
        }
        else {
            this.ui.keyReadOnly
            .prop('disabled', false);

            this.ui.valueReadOnly
            .prop('disabled', false);

            this.ui.value.prop('disabled', false);
            this.ui.textInputGroup.addClass('hide');
            this.ui.fileInputGroup.addClass('hide');
            this.ui.keyReadOnlyGroup.removeClass('hide');
            this.ui.valueReadOnlyGroup.removeClass('hide');
        }
    },

    onChangetypeInput(e) {
        if ( this.ui.fileInput.prop('checked') ) {
            this.model.set('type', CONST.tagType.file);
            this.ui.value.val('').prop('disabled', true);
        }
        else {
            this.model.set('type', CONST.tagType.text);
            this.ui.value.prop('disabled', false);
        }
    },

    onClickRemoveBtn(e) {
        this.model.destroy();
    },

    onCollectionUpdate() {
        const osmTags = this.model.collection.where({
            nonOsmData: false
        });

        if (osmTags.length === 0) {
            return this.model.collection.add({});
        }

        if ( this.model.get('nonOsmData') ) {
            this.ui.removeBtn.prop('disabled', false);
            return;
        }

        if (osmTags.length === 1) {
            this.ui.removeBtn.prop('disabled', true);
        }
        else {
            this.ui.removeBtn.prop('disabled', false);
        }
    },
});


import Marionette from 'backbone.marionette';
import listItemTemplate from './listItem.ejs';


export default Marionette.ItemView.extend({
    template: listItemTemplate,

    ui: {
        'key': '.key',
        'value': '.value',
        'keyReadOnly': '.key_read_only',
        'valueReadOnly': '.value_read_only',
        'nonOsmData': '.non_osm_data',
        'infoBtn': '.info_btn',
        'removeBtn': '.remove_btn',
    },

    events: {
        'blur @ui.key': 'updateKey',
        'blur @ui.value': 'updateValue',
        'keyup @ui.key': 'updateKey',
        'keyup @ui.value': 'updateValue',
        'change @ui.keyReadOnly': 'onChangeKeyReadOnly',
        'change @ui.valueReadOnly': 'onChangeValueReadOnly',
        'change @ui.nonOsmData': 'onChangeNonOsmData',
        'click @ui.removeBtn': 'onClickRemoveBtn',
    },

    initialize: function () {
        this.listenTo(this.model.collection, 'sync', this.onCollectionUpdate);
        this.listenTo(this.model.collection, 'reset', this.onCollectionUpdate);
        this.listenTo(this.model.collection, 'update', this.onCollectionUpdate);
        this.listenTo(this.model.collection, 'change', this.onCollectionUpdate);
    },

    templateHelpers: function () {
        return {
            'cid': this.model.cid
        };
    },

    onRender: function () {
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

        this.onChangeValueReadOnly();
        this.onChangeKeyReadOnly();
        this.onChangeNonOsmData();

        this.renderTagInfo();

        this.onCollectionUpdate();
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

    updateValue: function (e) {
        this.model.set(
            'value',
            this.ui.value.val().trim()
        );
    },

    onChangeKeyReadOnly: function (e) {
        this.model.set('keyReadOnly', this.ui.keyReadOnly.prop('checked'));

        this.ui.valueReadOnly.prop(
            'disabled',
            !this.model.get('keyReadOnly')
        );

        if ( !this.model.get('keyReadOnly') ) {
            this.ui.valueReadOnly.prop('checked', false);
        }
    },

    onChangeValueReadOnly: function (e) {
        this.model.set('valueReadOnly', this.ui.valueReadOnly.prop('checked'));
    },

    onChangeNonOsmData: function (e) {
        this.model.set('nonOsmData', this.ui.nonOsmData.prop('checked'));

        this.ui.keyReadOnly
        .prop('checked', true)
        .prop(
            'disabled',
            this.model.get('nonOsmData')
        );
        this.ui.valueReadOnly
        .prop('checked', false)
        .prop(
            'disabled',
            this.model.get('nonOsmData')
        );
    },

    onClickRemoveBtn: function (e) {
        this.model.destroy();
    },

    enableRemoveButton: function () {
        this.ui.removeBtn.prop('disabled', '');
    },

    disableRemoveButton: function () {
        this.ui.removeBtn.prop('disabled', 'disabled');
    },

    onCollectionUpdate: function () {
        const osmTags = this.model.collection.where({
            'nonOsmData': false
        });

        if (osmTags.length === 0) {
            this.model.collection.add({});
        }
        else if (osmTags.length === 1) {
            this.disableRemoveButton();
        }
        else {
            if ( !this.model.get('nonOsmData') ) {
                this.enableRemoveButton();
            }
        }
    },
});
